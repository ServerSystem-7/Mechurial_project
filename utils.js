const puppeteer = require("puppeteer"),
    fs = require("fs"),
    cheerio = require("cheerio"),
    db = require("./models/index"),
    nodeCron = require("node-cron"),
    utils = require("./utils");

db.sequelize.sync({alter: false});
const Page = db.pageTBL;
const Register = db.registerTBL;
const User = db.userTBL;

require('dotenv').config();
const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);


exports.sendEmail = async (reademailaddress, str, title) => {
    try{
        await sendgrid.send({
        to: reademailaddress,
        from: 'ssc22.team.07@gmail.com',
        subject: title,
        text: str,
    });
    } catch(err) {
        console.log(err);
    };
}

exports.generateRandom = (min, max) => {
    const randomNumber = Math.floor(Math.random() * (max-min+1)) + min;
    return randomNumber;
}

exports.increment_path = (path, overwrite = false) => {
    if (overwrite){
        return path
    }
    else {
        file_name = path.split(".").slice(0,-1).join(".")
        file_ext = path.split(".").pop()
        let i = 0
        while (fs.existsSync("./crawling_results/" + `${file_name}_${i}.${file_ext}`))
            i = i + 1
        return `${file_name}_${i}.${file_ext}`
    }
}

exports.get_user_email = async (registerId) => {
    let register = await Register.findOne( {where: {registerId: registerId}} )
    let user = await User.findOne( {where: {id: register["userId"]}})
    return user["email"]
}

exports.make_email_title = async (registerId) => {
    let register = await Register.findOne( {where: {registerId: registerId}})
    return `[메추리알 알림] ${register["siteName"]} 사이트를 확인하세요!`
}

exports.make_email_body = async (registerId) => {
    let register = await Register.findOne( {where: {registerId: registerId}})
    return `
    ${register["siteName"]} 사이트를 확인하세요!
    내가 등록한 사이트 바로가기: ${register["pageUrl"]}

    요청하신 키워드는: ${register["key1"]}, ${register["key2"]}, ${register["key3"]}
    키워드 포함 조건: ${register["notifyLogic"]}

    알림 사유: 설정한 마감일 전 등록 조건 일치!

    알림이 성공적으로 이루어졌으므로 등록은 삭제됩니다.

    메추리알을 사용해주셔서 감사합니다.
    `
}

exports.send_register_email = async (receiver_email, email_title, email_body) => {
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
