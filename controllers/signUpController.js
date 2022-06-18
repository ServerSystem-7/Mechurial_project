const db = require('../models'),
sendEmail = require("../sendEmail"),
utils = require("../utils");
  

let number;
        
module.exports = {
    signUp_main : (req, res) => {
        is_logined = req.session.is_logined;
        userid =  req.session.userId;
        res.render("signUp_main");
    },

    signUp_terms : (req,res) => {
        is_logined = req.session.is_logined;
        userid =  req.session.userId;
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
            res.send({ str : 'fail' });
            console.error(err);
            next(err);
        }
    },

    createUser : async (req,res, next) => {
        try {
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

        }catch{}
    },

    sendMail : async (req, res, next) => {
        try{
            const EA = req.body.EA;

            // 이메일 중복 검사
            let isDuplicateEA= await db.userTBL.findOne({
                where:{email : EA}
                });
            
            if (isDuplicateEA){
                console.log("중복된 이메일입니다.");
                res.send({
                    result : 'fail'
                })
            }
            else{
                number = utils.generateRandom(111111, 999999);

                let str = 
                `메추리알 서비스를 이용해주셔서 감사합니다.
                인증번호는 ${number} 입니다.`

                let title=
                `[메추리알] 인증번호는 ${number} 입니다.`
                
                await sendEmail(EA, str, title);
                console.log("인증메일 전송");
                res.send({
                    result:'success'
                });   }
            
            

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
            }
            else console.log("인증 실패");
            
            console.log(isAuthedEA);
            res.send(isAuthedEA);
        } catch(err){
            console.error(err);
            next(err);
            res.send({ result : 'fail' });
        };
    },
    
    signUp_complete : (req,res) => {
        is_logined = req.session.is_logined;
        userid =  req.session.userId;
        res.render("signUp_complete");
    },

};