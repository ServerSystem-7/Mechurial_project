const db = require("../models/index"),
  bcrypt = require("bcrypt"),
  utils = require("../utils"),
  User = db.userTBL,
  Register = db.registerTBL,
  Page = db.pageTBL;

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
    deleteUser: async(req, res, next) => {
      const userId = req.session.userId;
      console.log(userId);

      let urls = await Register.findAll({
        attributes: ["pageUrl"],
        where:{userId:userId},
        raw: true
      });
      let url_array = urls.map(a => a.pageUrl);
      let url_set = new Set(url_array)
      url_array = Array.from(url_set)
      console.log(url_array)

      try{
        let user = await User.findByPkAndRemove(userId);
        res.locals.user = user;
        req.session.distroy;
        res.clearCookie("sid");
      } catch (error) {
          console.log(`Error deleting user by ID: ${error.message}`);
          next(error);
      }

      for (let idx = 0; idx < url_array.length; idx++) {
        try{
            let result = await Register.count({
                where: {pageUrl:url_array[idx]}
            })
            if(result === 0){
                console.log('url 혼자 사용 중');
                let page = await Page.findByPkAndRemove(url_array[idx]);
                res.locals.page = page;
                is_logined = false;
                userid = null;
                res.render("mainpage");
            }else {
                console.log('url 중복 사용 중');
                is_logined = false;
                userid = null;
                res.render("mainpage");
            }
        }catch(error){
            console.log(`Error deleting register or page by ID: ${error.message}`);
            next(error);
        } 
      }
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
      let userId = req.body.id;
      try{
          let user =  await User.findByPk(userId);

          if(user){
              let passwordMatch = await user.passwordComparison(req.body.password);
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
                  
                  
              }
          } else{
              is_logined = req.session.is_logined;
              userid =  req.session.userId;
              res.redirect("/login_main");
              
          }
      }catch(err){
          console.log('error!!!');
          next(err);
      };
      },

      // 메일전송_인증번호
    sendMail_cerNum: async (req, res, next) =>{
      try{
        
        const reademailaddress = req.body.EA;

        //이메일에 해당하는 사용자가 있는지 확인.
        let user =  await User.findOne({ where: {email: reademailaddress}});

        if(user){
          number = utils.generateRandom(111111, 999999);

          let str = 
          `메추리알 서비스를 이용해주셔서 감사합니다.
          인증번호는 ${number} 입니다.`
          let title=
          `[메추리알] 인증번호는 ${number} 입니다.`

          
          await utils.sendEmail(reademailaddress, str, title);
            res.send({
              result:'ok'
            });    
        }else{
          res.send({result:'noUser'})}

      }catch(err){
        res.end();
        console.error(err);
        next(err);
      };
    },


    // 메일전송_아이디찾기 
    sendMail_id : async(req,res,next) =>{

      try{
        let isAuthedEA=req.body.isAuthedEA;
        const EA = req.body.EA;
        isAuthedEA=true;
            
        let userId =  await db.userTBL.findOne({
          attributes: ['id'],
          where: {email : EA},
          raw:true
        });
        
        let str=
          `메추리알 서비스를 이용해주셔서 감사합니다.
          인증하신 이메일로 가입한 아이디는 ${userId.id} 입니다.`

        let title=
          `[메추리알] 분실 아이디를 알려드립니다.`

        await utils.sendEmail(EA, str, title);
        res.send({result:'ok'});

    }catch{console.error(err);
      next(err);
      res.send({result:'fail'});}

    },
        

    //인증번호 확인
    checkCerNum : async (req,res,next)=>{
      try{
        const CEA = req.body.CEA;

        if(CEA==number){
          next();
;        }
        else{
          res.send({result:'notMatch'});
        }

      } catch(err){
          console.error(err);
          next(err);
          res.send({result:'fail'});
      };
  },


  // 비밀번호 찾기_아이디-이메일 일치 및 존재 여부 확인
    checkIdEmail :  async (req,res,next) =>{
      try{
        const email = req.body.EA;
        const cerNum = req.body.CEA;
        const id = req.body.id;
        let isAuthedEA = req.body.isAuthedEA;
        let isValidId = req.body.isValidId;
        
        if (id==undefined)
          res.send({
            result:'unmatch'
          });
    
        req.session.inputId = id;

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
            result:'ok',
            isAuthedEA:isAuthedEA,
            isValidId:isValidId
        }) 
      }catch(err){
        console.error(err);
        next(err);
        res.send({ result:'fail'});
      }
    },

    changePW: (req,res) => {
      is_logined = req.session.is_logined;
      userid =  req.session.userId;
      res.render("mypage_pw");
    },

    // 비밀번호 변경
    applyNewPw : async (req,res,next) =>{
      try{
        let newPw = req.body.password;
        let hash = await bcrypt.hash(newPw, 10);
        newPw = hash;
        let id;
        
        if(req.session.userId==undefined){
          //mypage에서 비밀번호 변경시
          id=req.session.inputId;
        } else{ 
          //비밀번호 찾기를 통해 비밀번호 변경시
          id=req.session.userId;
        }
        await db.userTBL.update({password:newPw}, {where:{id:id}});
        
          

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

    // 이메일 변경_새로 입력한 이메일 중복 확인 및 인증메일 전송
    checkNewEmail : async (req,res,next) =>{
      try{
        
        const EA = req.body.email;
        console.log(EA);

        // 이메일 중복 검사
        let isDuplicateEA= await db.userTBL.findOne({
          where:{email : EA}
          });
      
      if (isDuplicateEA){
          res.send({
              result : 'redup'
          })
      }else{
          number = utils.generateRandom(111111, 999999);

          let str = 
          `메추리알 서비스를 이용해주셔서 감사합니다.
          인증번호는 ${number} 입니다.`
          let title=
          `[메추리알] 인증번호는 ${number} 입니다.`
          
          await utils.sendEmail(EA, str, title);
          res.send({result:"ok"});
        }

    }catch(err){
      console.error(err);
        next(err);
        res.send({result:'fail'});
      }
    },

    // 새 이메일 적용
    applyNewEmail: async (req,res,next)=>{
      try{
        const newEmail = req.body.email;
        await db.userTBL.update({email:newEmail}, {where:{id:req.session.userId}});

        res.send({result:'ok'});

    }catch(err){
      console.error(err);
      next(err);
      res.send({result:'fail'});
    };
    },

    showInputNewPw: (req,res)=>{
      res.render("search_pw2");
    },

    cerNumOk: (req,res)=>{
      res.send({result:"ok"});
    }
    
  }