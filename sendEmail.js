
// [START compute_send]
// This sample is based off of:
// https://github.com/sendgrid/sendgrid-nodejs/tree/master/packages/mail
require('dotenv').config();
const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async function sendEmail(reademailaddress, number) {
    try{
        await sendgrid.send({
        to: reademailaddress,
        from: 'ssc22.team.07@gmail.com',
        subject: 'Sendgrid test email from Node.js on Google Cloud Platform',
        text: '인증번호는 '+ number+ '입니다.',
    });
    } catch(err) {
        console.log(err);
    };
}

