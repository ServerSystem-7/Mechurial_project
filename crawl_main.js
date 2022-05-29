const puppeteer = require("puppeteer"),
    fs = require("fs"),
    path = require("path"),
    cheerio = require("cheerio"),
    db = require("./models/index"),
    nodeCron = require("node-cron");


db.sequelize.sync({alter: true});
const Page = db.page;
const Register = db.register;

// crawl & save it as an html file
async function save_html(url, file_name) {
    console.log("============= save_html() =============")
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],  // no-sandbox b/c sudo??
    });
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'});  // go to the page to parse
    await page.waitFor(3000);
    const html = await page.content();  // extract data from the page

    fs.writeFileSync(file_name, html);  // save file
    console.log("saved html file as " + file_name);
    
    await browser.close();  // close browser (to prevent memory leak)
}

const save_dir = "./public/crawl_results/";
async function crawl_and_check(url) {
    console.log("============= crawl_and_check() =============")
    file_name = save_dir + "file3.html"  // TODO: increment & path join?
    await save_html(url, file_name);
    console.log(`saved ${file_name}`);

    result_arr = await check_register(url, file_name);
    return `Done: ${url}`, result_arr
}

async function check_register(url_link, url_file) {  // TODO: simplify
    console.log("============= check_register() =============")
    // all register instances of the url_link
    let registrations = await Register.findAll({
        where: {pageUrl: url_link},
        raw: true
    }) // list of objects(=instances)

    let satisfied = registrations.map(
        a => ({regNumber: a.regNumber, satisfied: false})
    );
    console.log("initialized satisfied array as:")
    console.log(satisfied)

    const $ = cheerio.load(fs.readFileSync(url_file));
    const whole_text = $.text();
    
    for (id = 0; id < registrations.length; id++) {
        cur_reg = registrations[id]
        keywords = [cur_reg["key1"], cur_reg["key2"], cur_reg["key3"]]  // TODO: exclude null values
        logic = registrations[id]["notifyLogic"]
        satisfied[id]["satisfied"] = check_keyword_match(whole_text, keywords, logic)  // TODO: id -> regNumber
    }
    return satisfied
}

function check_keyword_match(whole_text, keywords, logic) {
    console.log("============= check_keyword_match() =============")
    if (logic === "and") {
        return keywords.every(x => whole_text.includes(x))
    } else if (logic === "or") {
        return keywords.some(x => whole_text.includes(x))
    } else {
        return "n/a"  // TODO: throw error?
    }
}

// find URLs
let url_array
let failed_url_array = [];
async function run_all_urls() {
    let pages = await Page.findAll({raw: true})
    console.log(pages.every(page => page instanceof Page))  // false
    console.log("All pages:", JSON.stringify(pages, null, 2));
    url_array = pages.map(a => a.url);  // ["url1", "url2", ..]
    console.log(url_array)
    run_loop()
}

function run_loop() {
    for (let idx = 0; idx < url_array.length; idx++) {
        crawl_and_check(url_array[idx]).then((message) => {
            console.log(message);
        }).catch((err) => {
            failed_url_array.push(url_array[idx]);
            console.log(err);
        })
    }
}

// every 30 seconds
const job = nodeCron.schedule("*/30 * * * * *", function () {
    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    console.log(`${hours}:${minutes}:${seconds}`);
    run_all_urls()
    console.log("nodeCron is super cool!");
}, {
    scheduled: false,
});
job.start();

// =====================================================================================================================
// function for checking url validity at register page.
let cur_reg = {
    key1: "파이낸셜",
    key2: "데이터",
    key3: "분석",
    logic: "and"
}
async function check_url_validity(url_link, cur_reg) {  // cur_reg: obj
    console.log("============= check_url_validity() =============")
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],  // no-sandbox b/c sudo??
    });
    const page = await browser.newPage();
    await page.goto(url_link, {waitUntil: 'networkidle2'});  // TODO: handle exception
    await page.waitFor(3000);
    const html = await page.content();  // extract data from the page
    // TODO: parse?

    keywords = [cur_reg["key1"], cur_reg["key2"], cur_reg["key3"]]
    logic = cur_reg["notifyLogic"]
    return check_keyword_match(html, keywords, logic)  // bool
    
}
