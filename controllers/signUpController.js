/* const db = require("../models/index"),
User = db.user,*/
"use strict";

const generateRandom = function(min, max) {
    const randomNumber = Math.floor(Math.random() * (max-min+1)) + min;
    return randomNumber;
}
const number = generateRandom(111111, 999999)

module.exports = {
    signUp_main : (req, res) => {
        res.render("signUp_main");
    },

    signUp_terms : (req,res) => {
        res.render("signUp_terms");
    },

    emailAuth : async (req, res, next) => {
            
            try{
                const reademailaddress = req.body.EA;

            // [START compute_send]
            // This sample is based off of:
            // https://github.com/sendgrid/sendgrid-nodejs/tree/master/packages/mail
            require('dotenv').config();
            const sendgrid = require('@sendgrid/mail');
            sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
                
            try{
                async function sendgridExample() {
                    await sendgrid.send({
                    to: reademailaddress,
                    from: 'ssc22.team.07@gmail.com',
                    subject: 'Sendgrid test email from Node.js on Google Cloud Platform',
                    text: '인증번호는 '+ number+ '입니다.',
                    });
                    }
                    sendgridExample();
            } catch(err){
                res.send({ result : 'fail' });
                console.error(err);
                next(err);
            }
                
            } catch(err){
            res.send({ result : 'fail' });
            console.error(err);
            next(err);
        };
    },
    emailCert : async (req,res,next)=>{
        try{
            const CEA = req.body.CEA;
            if(CEA==number){
                res.send({result:'success'});
                console.log("인증 성공");
            }
            else{
                res.send({result:'fail'});
                console.log("인증 실패");
            }
        } catch(err){
            res.send({ result : 'fail' });
            console.error(err);
            next(err);
        };
    },

    signUp_complete : (req,res) =>{
        res.render("signUp_complete");
    }

};