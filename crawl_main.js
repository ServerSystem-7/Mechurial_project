const puppeteer = require("puppeteer"),
    fs = require("fs"),
    cheerio = require("cheerio"),
    db = require("./models/index"),
    nodeCron = require("node-cron"),
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
    console.log("============= save_html() =============")
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],  // no-sandbox b/c sudo
    });
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'});  // go to the page to parse
    await page.waitFor(3000);
    const html = await page.content();  // extract data from the page

    fs.writeFileSync(file_name, html);  // save file
    console.log("saved html file as " + file_name);
    
    await browser.close();  // close browser (to prevent memory leak)
}

async function check_register(url_link, url_file) {
    console.log("============= check_register() =============")
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
        keywords = keywords.filter((key) => {
            key.length > 0
        })
        console.log(49, keywords)

        let logic = registrations[id]["notifyLogic"]
        satisfied[id]["satisfied"] = await check_keyword_match(url_file, keywords, logic)
    }
    console.log("============= check_register() done =============")
    console.log(53, satisfied)
    return satisfied
}

function check_keyword_match(url_file, keywords, logic) {
    console.log("============= check_keyword_match() =============")
    console.log(59, url_file, keywords, logic)
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
    console.log("====== email_satisfied_register() =========")
    for (let idx = 0; idx < all_array.length; idx++) {
        if (all_array[idx]["satisfied"] === true) {
            let registerId = all_array[idx]["registerId"]
            console.log(92, "satisfied true regID: ", registerId)
            let receiver_email = await utils.get_user_email(registerId)
            let email_body = await utils.make_email_body(registerId)  // 1
            let email_title = await utils.make_email_title(registerId)
            await utils.sendEmail(receiver_email, email_body, email_title)
            await delete_satisfied_register(registerId)
        }
    }
}

async function delete_satisfied_register(registerId) {
    await Register.destroy({where: {registerId: registerId}})
    console.log(`deleted registerId: ${registerId}`)
}

async function crawl_and_check(url) {
    // file_name = save_dir + "file3.html"  // TODO: increment & path join?
    let current_time = new Date()
    let file_name = String(current_time.getTime()) + ".html"
    let save_path = save_dir + utils.increment_path(file_name)  // temp
    await save_html(url, save_path);

    let result_array = await check_register(url, save_path);
    await email_satisfied_register(result_array)
}

async function run_all_urls() {
    let pages = await Page.findAll({raw: true})
    let url_array = pages.map(a => a.url);  // ["url1", "url2", ..]
    console.log("All URLs: ", url_array)

    for (let idx = 0; idx < url_array.length; idx++) {
        crawl_and_check(url_array[idx])
    }
}

// run every minute
const job = nodeCron.schedule("0 * * * * *", function () {
    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    console.log(`running at: ${hours}:${minutes}:${seconds}`);
    run_all_urls()
}, {
    scheduled: false,
});
job.start();
