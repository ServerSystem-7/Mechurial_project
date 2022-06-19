const puppeteer = require("puppeteer"),
    fs = require("fs"),
    cheerio = require("cheerio"),
    db = require("./models/index"),
    nodeCron = require("node-cron"),
    { Op } = require("sequelize"),
    utils = require("./utils");

db.sequelize.sync({alter: false});
const Page = db.pageTBL;
const Register = db.registerTBL;
const save_dir = "./crawling_results/";

if (!fs.existsSync(save_dir)){
    console.log("Created a new directory to save crawling results.")
    fs.mkdirSync(save_dir);
}

// crawl & save as an html file
async function save_html(url, file_name) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],  // no-sandbox b/c sudo
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url, {waitUntil: 'networkidle2'});  // go to the page to parse
    await page.waitFor(3000);
    const html = await page.content();  // extract data from the page

    fs.writeFileSync(file_name, html);  // save file
    console.log("saved html file as " + file_name);
    
    await browser.close();  // close browser (to prevent memory leak)
}

async function check_register(url_link, url_file) {
    // all register instances of the url_link
    let registrations = await Register.findAll({
        where: {pageUrl: url_link},
        raw: true
    })

    let satisfied = registrations.map(
        a => ({registerId: a.registerId, satisfied: false})
    );

    for (id = 0; id < registrations.length; id++) {
        let cur_reg = registrations[id]

        let keywords = [cur_reg["key1"], cur_reg["key2"], cur_reg["key3"]]
        let validKeywords = keywords.filter((key) => {
            key.length > 0
        })

        let logic = registrations[id]["notifyLogic"]
        satisfied[id]["satisfied"] = await check_keyword_match(url_file, validKeywords, logic)
    }
    return satisfied
}

function check_keyword_match(url_file, keywords, logic) {
    const $ = cheerio.load(fs.readFileSync(url_file));
    const whole_text = $.text();

    if (logic === "and") {
        return keywords.every(x => whole_text.includes(x))
    } else if (logic === "or") {
        return keywords.some(x => whole_text.includes(x))
    } else {
        return false
    }
}

async function email_satisfied_register (all_array) {
    for (let idx = 0; idx < all_array.length; idx++) {
        if (all_array[idx]["satisfied"] === true) {
            let registerId = all_array[idx]["registerId"]
            let receiver_email = await utils.get_user_email(registerId)
            let email_body = await utils.make_email_body(registerId)
            let email_title = await utils.make_email_title(registerId)
            await utils.sendEmail(receiver_email, email_body, email_title)
            await delete_satisfied_register(registerId)
        }
    }
}

async function delete_satisfied_register(registerId) {
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

async function crawl_and_check(url) {
    let current_time = new Date()
    let file_name = String(current_time.getTime()) + ".html"
    let save_path = save_dir + utils.increment_path(file_name)
    await save_html(url, save_path);

    let result_array = await check_register(url, save_path);
    await email_satisfied_register(result_array)
}

async function run_all_urls() {
    let pages = await Page.findAll({raw: true})
    let url_array = pages.map(a => a.url);
    for (let idx = 0; idx < url_array.length; idx++) {
        crawl_and_check(url_array[idx])
    }
}

async function deleteOverdueRegistrations(current_date) {
    let overdue_registrations = await Register.findAll({
        where: {
            dueDate: {
                [Op.lt]: current_date
            }
        },
        raw: true
    })
    for (let idx = 0; idx < overdue_registrations.length; idx++) {
        let registerId = overdue_registrations[idx]["registerId"]
        let receiver_email = await utils.get_user_email(registerId)
        let email_title = await utils.make_email_title_overdue(registerId)
        let email_body = await utils.make_email_body_overdue(registerId)
        await utils.sendEmail(receiver_email, email_body, email_title)
        await delete_satisfied_register(registerId)
    }
}

// run every minute
const job = nodeCron.schedule("0 * * * * *", async function () {
    let date_ob = new Date();
    let SEOULTIMEZONE = 9 * 60 * 60
    await date_ob.setTime(date_ob.getTime() + SEOULTIMEZONE);  // time zone is set

    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    console.log(`running at: ${hours}:${minutes}:${seconds}`);

    let dd = String(date_ob.getDate()).padStart(2, '0');
    let mm = String(date_ob.getMonth() + 1).padStart(2, '0');  // January is 0
    let yyyy = date_ob.getFullYear();
    let current_date = `${yyyy}-${mm}-${dd}`

    await deleteOverdueRegistrations(current_date)
    run_all_urls()
}, {
    scheduled: false,
});
job.start();
