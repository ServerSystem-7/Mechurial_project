const puppeteer = require("puppeteer"),
    fs = require("fs"),
    cheerio = require("cheerio"),
    db = require("./models/index"),
    nodeCron = require("node-cron"),
    { Op } = require("sequelize"),
    utils = require("./utils"),
    path = require("path");

db.sequelize.sync({alter: false});
const Page = db.pageTBL;
const Register = db.registerTBL;
const saveDir = "./crawlingResults/";

if (!fs.existsSync(saveDir)){
    console.log("Created a new directory to save crawling results.")
    fs.mkdirSync(saveDir);
}

// crawl & save as an html file
async function saveHTML(url) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],  // no-sandbox b/c sudo
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url, {waitUntil: 'networkidle2'});  // go to the page to parse
    await page.waitFor(3000);
    const html = await page.content();  // extract data from the page
    
    let currentTime = new Date()
    let fileName = String(currentTime.getTime()) + ".html"
    let savePath = saveDir + await utils.incrementPath(fileName)

    fs.writeFileSync(savePath, html);  // save file
    console.log("saved html file as " + savePath);
    
    await browser.close();  // close browser (to prevent memory leak)
    return savePath
}

async function checkRegister(urlLink, urlFile) {
    // all register instances of the urlLink
    let registrations = await Register.findAll({
        where: {pageUrl: urlLink},
        raw: true
    })

    let satisfied = registrations.map(
        a => ({registerId: a.registerId, satisfied: false})
    );

    for (id = 0; id < registrations.length; id++) {
        let curReg = registrations[id]

        let keywords = [curReg["key1"], curReg["key2"], curReg["key3"]]
        let validKeywords = keywords.filter(key => key.length > 0)

        let logic = registrations[id]["notifyLogic"]
        satisfied[id]["satisfied"] = await checkKeywordMatch(urlFile, validKeywords, logic)
    }
    return satisfied
}

function checkKeywordMatch(urlFile, keywords, logic) {
    const $ = cheerio.load(fs.readFileSync(urlFile));
    const wholeText = $.text();

    if (logic === "and") {
        return keywords.every(x => wholeText.includes(x))
    } else if (logic === "or") {
        return keywords.some(x => wholeText.includes(x))
    } else {
        return false
    }
}

async function emailSatisfiedRegister (allArray) {
    for (let idx = 0; idx < allArray.length; idx++) {
        if (allArray[idx]["satisfied"] === true) {
            let registerId = allArray[idx]["registerId"]
            let receiverEmail = await utils.getUserEmail(registerId)
            let emailBody = await utils.makeEmailBody(registerId)
            let emailTitle = await utils.makeEmailTitle(registerId)
            await utils.sendEmail(receiverEmail, emailBody, emailTitle)
            await deleteSatisfiedRegister(registerId)
        }
    }
}

async function deleteSatisfiedRegister(registerId) {
    try{
        let register = await Register.findOne({where: {registerId: registerId}});
        const url = register["pageUrl"];
        await Register.destroy({where: {registerId: registerId}});
        console.log(`deleted registerId: ${registerId}`);
        let result= await Register.findOne({
        where:{pageUrl:url}
        })

        if(result==undefined){
            console.log('url 혼자 사용 중');
            let page = await Page.findByPkAndRemove(url);
        }else {
            console.log('url 중복 사용 중');
        }
    }catch(error){
        console.log("error!");
    };
}

async function crawlAndCheck(url) {
    let savePath = await saveHTML(url);
    let resultArray = await checkRegister(url, savePath);
    await emailSatisfiedRegister(resultArray)
}

async function runAllUrls() {
    // empty html saved directory
    fs.readdir(saveDir, (err, files) => {
        if (err) throw err;
        for (const file of files) {
          fs.unlink(path.join(saveDir, file), err => {
            if (err) throw err;
          });
        }
    });

    let pages = await Page.findAll({raw: true})
    let urlArray = pages.map(a => a.url);
    for (let idx = 0; idx < urlArray.length; idx++) {
        crawlAndCheck(urlArray[idx])
    }
}

async function deleteOverdueRegistrations(currentDate) {
    let overdueRegistrations = await Register.findAll({
        where: {
            dueDate: {
                [Op.lt]: currentDate
            }
        },
        raw: true
    })
    for (let idx = 0; idx < overdueRegistrations.length; idx++) {
        let registerId = overdueRegistrations[idx]["registerId"]
        let receiverEmail = await utils.getUserEmail(registerId)
        let emailTitle = await utils.makeEmailTitleOverdue(registerId)
        let emailBody = await utils.makeEmailBodyOverdue(registerId)
        await utils.sendEmail(receiverEmail, emailBody, emailTitle)
        await deleteSatisfiedRegister(registerId)
    }
}

// run every minute
const job = nodeCron.schedule("0 * * * * *", async function () {
    let dateOb = new Date();
    let SEOULTIMEZONE = 9 * 60 * 60 * 1000
    await dateOb.setTime(dateOb.getTime() + SEOULTIMEZONE);  // time zone is set

    let hours = dateOb.getHours();
    let minutes = dateOb.getMinutes();
    let seconds = dateOb.getSeconds();
    console.log(`running at: ${hours}:${minutes}:${seconds}`);

    let dd = String(dateOb.getDate()).padStart(2, '0');
    let mm = String(dateOb.getMonth() + 1).padStart(2, '0');  // January is 0
    let yyyy = dateOb.getFullYear();
    let currentDate = `${yyyy}-${mm}-${dd}`

    await deleteOverdueRegistrations(currentDate)
    runAllUrls()
}, {
    scheduled: false,
});
job.start();
