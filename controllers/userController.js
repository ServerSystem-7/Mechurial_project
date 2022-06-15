const db = require("../models/index"),
//cookieParser = require("cookie-parser"),
passport = require("passport");
sendEmail = require("../sendEmail");
randomNumber = require("../createRandomNumber"),
User = db.userTBL,
  getUserParams = (body) => {
    return {
      id: body.id,
      email: body.email,
      password: body.password
    };
  };

  let number;

module.exports = {
    login: (req, res)=>{
      is_logined = req.session.is_logined;
      userid =  req.session.userId;
      res.render("logIn_main");
    },
  logout: (req, res) => {
        is_logined = req.session.is_logined;
        userid =  req.session.userId;
        req.session.distroy;
        res.clearCookie("sid");
        res.redirect('logIn_main');
    },
    searchid: (req, res, next) => {
      is_logined = req.session.is_logined;
      userid =  req.session.userId;
      res.render("search_id");

    },
    
    searchPw:(req, res) => {
      is_logined = req.session.is_logined;
      userid =  req.session.userId;
      res.render("search_pw");
    },
      
    authenticate: async (req, res, next) => {
      try{
          let user =  await User.findOne({ where: {id: req.body.id}});
          if(user){
              let passwordMatch = await user.passwordComparison(req.body.password, user.password);
              if(passwordMatch){
                  console.log("일치");
                  req.session.is_logined = true;
                  req.session.userId = req.body.id;
                  res.locals.user = user;
                  res.redirect("/");
              }
              else{
                  console.log("불일치");
                  is_logined = req.session.is_logined;
                  userid =  req.session.userId;
                  res.redirect("/login_main");
                  next();
              }
          } else{
              is_logined = req.session.is_logined;
              userid =  req.session.userId;
              res.redirect("/login_main");
              next();
          }
      }catch(err){
          console.log('error');
          next(err);
      };
      },
      mypage: (req, res) => {  
        if(req.session.is_logined){
            let userId = req.session.userId;
            is_logined = req.session.is_logined;
            userid =  req.session.userId;
            try {
              User.findByPk(userId).then((user) => {
                res.render("mypage_main",{user});
              })
            }catch (error) {
              console.log("error!");
            }
        }
        else{
          is_logined = req.session.is_logined;
          userid =  req.session.userId;
          res.render("logIn_main");
        }
    },

    sendMail_cerNum: async (req, res, next) =>{
      try{
        const reademailaddress = req.body.EA;
        number = randomNumber(111111, 999999);

        let str = 
        `메추리알 서비스를 이용해주셔서 감사합니다.
        인증번호는 ${number} 입니다.`
        let title=
        `[메추리알] 인증번호는 ${number} 입니다.`

        
        await sendEmail(reademailaddress, str, title);
          console.log("인증메일 전송");
          res.send({
            number:number
          });
          //TODO: 등록되지 않은 이메일일땐, 안증메일 전송이 되지 않아야 합니다.     

      }catch(err){
        res.end();
        console.error(err);
        next(err);
      };
    },

    sendMail_id : async(req,res,next) =>{
      let isAuthedEA=req.body.isAuthedEA;
      const EA = req.body.EA;

      isAuthedEA=true;
          
      let userId =  await db.userTBL.findOne({
        attributes: ['id'],
        where: {email : EA},
        raw:true
      });
      

      console.log(userId);
      let str=
        `메추리알 서비스를 이용해주셔서 감사합니다.
        인증하신 이메일로 가입한 아이디는 ${userId.id} 입니다.`

      let title=
        `[메추리알] 분실 아이디를 알려드립니다.`

      await sendEmail(EA, str, title);
      res.send({result:'success'});
    },
        

    checkCerNum : async (req,res,next)=>{
      try{
        const CEA = req.body.CEA;

        if(CEA==number){
          console.log("인증 성공");
          next();
;        }
        else{
          console.log("인증 실패");
          res.send({result:'fail'});
        }

      } catch(err){
          console.error(err);
          next(err);
          res.end();
      };
  },


    checkIdEmail :  async (req,res,next) =>{
      try{
        const email = req.body.EA;
        const cerNum = req.body.CEA;
        const id = req.body.id;
        let isAuthedEA = req.body.isAuthedEA;
        let isValidId = req.body.isValidId;
        
        if (id==undefined)
          res.end();
    
        req.session.inputId = id;
        console.log("세션으로 임시생성한 id는 "+req.session.inputId);

        const userEmail = await db.userTBL.findAll({
          attributes: ['email'],
          where: {id : id},
          raw:true
        });    
        if (userEmail){
          if (userEmail[0].email == email)
            isValidId=true;
          
        }

        if(number==cerNum)
          isAuthedEA=true;

        res.send({
            isAuthedEA:isAuthedEA,
            isValidId:isValidId
        }) 
        
        
        
      }catch(err){
        console.error(err);
        next(err);
        res.end();
      }
    },

    
    changePW: (req,res) => {
      is_logined = req.session.is_logined;
      userid =  req.session.userId;
      res.render("mypage_pw");
    },


    applyNewPw : async (req,res,next) =>{
      try{
        const newPw=req.body.password;
        let id;
        
        if(req.session.userId==undefined){
          //mypage에서 비밀번호 변경시
          id=req.session.inputId;
        } else{ 
          //비밀번호 찾기를 통해 비밀번호 변경시
          id=req.session.userId
        }
        
        let user = await db.userTBL.findOne({
            where: {id : id}
          })

          const params = {
            id : user.id,
            email : user.email,
            password : newPw }
        
          await db.userTBL.findByPkAndUpdate(req.session.userId, params);

          res.send({result:"ok"});
      
      }catch(err){
        console.error(err);
        next(err);
        res.send({result:'fail'});
      }
    },



    showChangeEmail : (req,res) =>{
      res.render("mypage_email");
    },

    checkNewEmail : async (req,res) =>{
      try{
        const newEmail = req.body.email;

        let user = await db.userTBL.findOne({
          where: {email:newEmail}
        });

        if(user){
          console.log("이메일 중복");
          res.send({result:'fail'});
        }
        else{
          number = randomNumber(111111, 999999);

          let str = 
          `메추리알 서비스를 이용해주셔서 감사합니다.
          인증번호는 ${number} 입니다.`
          let title=
          `[메추리알] 인증번호는 ${number} 입니다.`
          
          await sendEmail(newEmail, str, title);
          res.send({result:"ok"});
        }

    }catch(err){
      console.error(err);
        next(err);
        res.send({result:'fail'});
      }
    },

    showInputNewPw: (req,res)=>{
      res.render("search_pw2");
    },

    cerNumOk: (req,res)=>{
      res.send({result:"ok"});
    },
    
    applyNewEmail: async (req,res)=>{
      try{
        const newEmail = req.body.email;

        let user = await db.userTBL.findOne({
          where: {id : req.session.userId}
        })
        console.log(user);
        console.log('----------------------');

        const params = {
          id : user.id,
          email : newEmail,
          password : user.password }

        await db.userTBL.findByPkAndUpdate(req.session.userId, params);
        console.log(user);
        req.send({result:'ok'});

    }catch(err){
      console.error(err);
      next(err);
      res.send({result:'fail'});
    }

    }


    



  }