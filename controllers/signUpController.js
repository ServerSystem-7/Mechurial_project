//const {sequelize} = require('../models/user');
const db = require('../models');
//const usertbl = require("../models/user");

//"use strict";



//인증번호 생성
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
    
    idChk : async (req, res, next) => {
        try{
            const id = req.body.id;
            let flag=false;
        
            let result= await db.usertbl.findOne({
            where:{id}
            })

            if(result==undefined){
                console.log('아이디 사용 가능');
                flag=true;
            }else {
                console.log('아이디 사용 불가능');
                flag=false;
            }
            res.send(flag);
            
        } catch(err){
            res.send({ result : 'fail' });
            console.error(err);
            next(err);
        }
        
    },


    createUser :  (req,res) => {
        const id = req.body.id;
        const pw = req.body.pw;
        const em = req.body.em;

        console.log("아이디는 "+id +"\n");
        console.log("비밀번호는 "+pw +"\n");
        console.log("이메일은 "+em +"\n");

        db.usertbl.create({
            id:id,
            password:pw,
            email:em
        }).then(
            res.send({result:'success'})
            )
        
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

                async function sendgridExample() {
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
                };
                await sendgridExample();
                console.log("실행됨");
                res.send({result:'success'});
                

            } catch(err){
                res.send({ result : 'fail' });
                console.error(err);
                next(err);
        };
    },

    emailCert : async (req,res,next)=>{
        try{
            console.log("eamilCert 실행");
            const CEA = req.body.CEA;
        
            if(CEA==number){
                console.log("인증 성공");
                var isAuthedEA=req.body.isAuthedEA;
                isAuthedEA=true;
                res.send(isAuthedEA);
                 
            }
            else{
                console.log("인증 실패");
                res.end();
                
            }
        } catch(err){
            console.error(err);
            next(err);
            res.send({ result : 'fail' });
        };
    },
    
    signUp_complete : (req,res) => {
        res.render("signUp_complete");
    },

};