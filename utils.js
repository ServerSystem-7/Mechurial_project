const fs = require("fs"),
    db = require("./models/index");

db.sequelize.sync({alter: false});
const Register = db.registerTBL;
const User = db.userTBL;

require('dotenv').config();
const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    sendEmail: async (receiver_email, body, title) => {
        try{
            await sendgrid.send({
            to: receiver_email,
            from: process.env.SENDGRID_SENDER_EMAIL,
            subject: title,
            text: body,
        });
        } catch(err) {
            console.log(err);
        };
    },

    generateRandom: (min, max) => {
        const randomNumber = Math.floor(Math.random() * (max-min+1)) + min;
        return randomNumber;
    },

    increment_path: (path, overwrite = false) => {
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
    },

    get_user_email: async (registerId) => {
        let register = await Register.findOne( {where: {registerId: registerId}} )
        let user = await User.findOne( {where: {id: register["userId"]}})
        return user["email"]
    },

    make_email_title: async (registerId) => {
        let register = await Register.findOne( {where: {registerId: registerId}})
        return `[메추리알 알림] ${register["siteName"]} 사이트를 확인하세요!`
    },

    make_email_title_overdue: async (registerId) => {
        let register = await Register.findOne( {where: {registerId: registerId}})
        return `[메추리알 알림] ${register["siteName"]} 사이트에 대해 설정하신 알림 마감 날짜가 지났습니다.`
    },

    make_email_body: async (registerId) => {
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
    },

    make_email_body_overdue: async (registerId) => {
        let register = await Register.findOne( {where: {registerId: registerId}})
        return `
        ${register["siteName"]} 사이트에 원하시는 조건의 업데이트가 이루어지지 않았습니다.
        내가 등록한 사이트 바로가기: ${register["pageUrl"]}

        요청하신 키워드는: ${register["key1"]}, ${register["key2"]}, ${register["key3"]}
        키워드 포함 조건: ${register["notifyLogic"]}

        알림 사유: 알림 마감 날짜 지남

        설정하신 등록이 이제 무효하므로 등록은 삭제됩니다.

        메추리알을 사용해주셔서 감사합니다.
        `
    }

}
