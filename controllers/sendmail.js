'use strict';
 
// [START compute_send]
// This sample is based off of:
// https://github.com/sendgrid/sendgrid-nodejs/tree/master/packages/mail
require('dotenv').config();
const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
 
async function sendgridExample() {
 await sendgrid.send({
   to: '20180965@sungshin.ac.kr',
   from: 'ssc22.team.07@gmail.com',
   subject: 'Sendgrid test email from Node.js on Google Cloud Platform',
   text: 'Well hello! This is a Sendgrid test email from Node.js on Google Cloud Platform.',
 });
}
sendgridExample();