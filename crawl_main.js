const puppeteer = require("puppeteer"),
    fs = require("fs"),
    cheerio = require("cheerio"),
    db = require("./models/index");
    nodeCron = require("node-cron");

db.sequelize.sync({alter: false});
const Page = db.pageTBL;
const Register = db.registerTBL;
const User = db.userTBL;

const save_dir = "./crawling_results/";

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

if (!fs.existsSync(save_dir)){
    console.log("Created a new directory to save crawling results.")
    fs.mkdirSync(save_dir);
}

async function crawl_and_check(url) {
    console.log("============= crawl_and_check() =============")
    // file_name = save_dir + "file3.html"  // TODO: increment & path join?
    file_name = save_dir + url.slice(-3) + ".html"  // temp
    await save_html(url, file_name);
    console.log(`saved ${file_name}`);

    let result_array = await check_register(url, file_name);
    return result_array
}

async function check_register(url_link, url_file) {  // TODO: simplify
    console.log("============= check_register() =============")
    // all register instances of the url_link
    let registrations = await Register.findAll({
        where: {pageUrl: url_link},
        raw: true
    }) // list of objects(=instances)

    let satisfied = registrations.map(
        a => ({registerId: a.registerId, satisfied: false})
    );

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

async function get_user_email(registerId) {
    let register = await Register.findOne( {where: {registerId: registerId}} )
    let user = await User.findOne( {where: {id: register["userId"]}})
    return user["email"]
}

async function make_email_body(registerId) {
    let register = await Register.findOne( {where: {registerId: registerId}})
    return `
    ${register["siteName"]} 사이트를 확인하세요!
    내가 등록한 사이트 바로가기: ${register["pageUrl"]}

    요청하신 키워드는: ${keywords}
    키워드 포함 조건: ${register["notifyLogic"]}

    알림 사유: 설정한 마감일 전 등록 조건 일치!

    알림이 성공적으로 이루어졌으므로 등록은 삭제됩니다.

    메추리알을 사용해주셔서 감사합니다.
    `
}

async function make_email_title(registerId) {
    let register = await Register.findOne( {where: {registerId: registerId}})
    return `[메추리알 알림] ${register["siteName"]} 사이트를 확인하세요!`
}

async function send_register_email(receiver_email, email_title, email_body) {
    require('dotenv').config();
    const sendgrid = require('@sendgrid/mail');
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    try{
        await sendgrid.send({
            to: receiver_email,
            from: 'ssc22.team.07@gmail.com',
            subject: email_title,
            text: email_body,
        });
        console.log("email sent successfully!")
    } catch(err) {
        console.log(err);
    };
}

async function email_satisfied_register (all_array) {
    for (let idx = 0; idx < all_array.length; idx++) {
        if (all_array[idx]["satisfied"]) {
            let registerId = all_array[idx]["registerId"]
            let receiver_email = await get_user_email(registerId)
            let email_body = await make_email_body(registerId)
            let email_title = await make_email_title(registerId)
            await send_register_email(receiver_email, email_title, email_body)
            await delete_satisfied_register(registerId)
        }
    }
}

async function delete_satisfied_register(registerId) {
    await Register.destroy({where: {registerId: registerId}})
    console.log(`deleted registerId: ${registerId}`)
}

const TOTAL_REG_NUMBER = 3  // temporary
function run_loop() {
    let final_array = []
    for (let idx = 0; idx < url_array.length; idx++) {
        crawl_and_check(url_array[idx]).then((partial_array) => {
            final_array = final_array.concat(partial_array)
            console.log(final_array)
            // 등록 개수에 따라 최종 배열만 출력하도록 임시로 처리
            if (final_array.length >= TOTAL_REG_NUMBER) {
                console.log("final array is")
                console.log(final_array)
                email_satisfied_register(final_array)  // TODO: await?
            }
        }).catch((err) => {
            failed_url_array.push(url_array[idx]);
            console.log(err);
        })
    }
}

// find URLs
let url_array
let failed_url_array = [];
async function run_all_urls() {
    let pages = await Page.findAll({raw: true})
    url_array = pages.map(a => a.url);  // ["url1", "url2", ..]
    console.log(url_array)
    await run_loop()
    console.log("========= Done! =========")
}

// *:*:0, *:*30 (30초마다 실행됨)
const job = nodeCron.schedule("*/30 * * * * *", function () {
    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    console.log(`running at: ${hours}:${minutes}:${seconds}`);
    failed_url_array = [];
    final_array = [];
    run_all_urls()
}, {
    scheduled: false,
});
job.start();



// =====================================================================================================================
// function for checking url validity at register page.
// let cur_reg = {
//     key1: "파이낸셜",
//     key2: "데이터",
//     key3: "분석",
//     logic: "and"
// }
// async function check_url_validity(url_link, cur_reg) {  // cur_reg: obj
//     console.log("============= check_url_validity() =============")
//     const browser = await puppeteer.launch({
//         args: ['--no-sandbox', '--disable-setuid-sandbox'],  // no-sandbox b/c sudo??
//     });
//     const page = await browser.newPage();
//     await page.goto(url_link, {waitUntil: 'networkidle2'});  // TODO: handle exception
//     await page.waitFor(3000);
//     const html = await page.content();  // extract data from the page
//     // TODO: parse?

//     keywords = [cur_reg["key1"], cur_reg["key2"], cur_reg["key3"]]
//     logic = cur_reg["notifyLogic"]
//     return check_keyword_match(html, keywords, logic)  // bool
    
// }