const db = require('../models'),
sendEmail = require("../sendEmail"),
randomNumber = require("../createRandomNumber");
  

let number;
        
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
        
            let result= await db.userTBL.findOne({
            where:{id : id}
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

        db.userTBL.create({
            id:id,
            password:pw,
            email:em
        }).then(
            res.send({result:'success'})
            )
    },

    sendMail : async (req, res, next) => {
        try{
            const reademailaddress = req.body.EA;
            number = randomNumber(111111, 999999);

            await sendEmail(reademailaddress, number);
            console.log("인증메일 전송");
            res.send({result:'success'});   

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