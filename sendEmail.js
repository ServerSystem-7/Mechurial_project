
// [START compute_send]
// This sample is based off of:
// https://github.com/sendgrid/sendgrid-nodejs/tree/master/packages/mail
require('dotenv').config();
const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async function sendEmail(reademailaddress, str, title) {
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

