const { render } = require("ejs");
const db = require("../models/index"),
//cookieParser = require("cookie-parser"),
passport = require("passport");
sendEmail = require("../sendEmail");
randomNumber = require("../createRandomNumber");
  
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
      res.render("logIn_main");
    },
  logout: (req, res) => {
        req.session.distroy;
        res.clearCookie("sid");
        res.redirect('logIn_main');
    },
    searchid: (req, res, next) => {
      res.render("search_id");

    },
    
    searchPw:(req, res) => {
      res.render("search_pw");
    },
      
  index: async (req, res, next) => {
    try {
      let users = await User.findAll();
      res.locals.users = users;
      next();
    } catch (error) {
      console("error!");
      next(error);
    }
  },
  indexView: (req, res) => {
    res.render("users/index"); // 주소 다시 입력
  },
  new: (req, res) => {
    res.render("enroll");
  },
  create: async (req, res, next) => {
    if(req.skip) next();
    let userParams = getUserParams(req.body);
    console.log(1);
    try{
        let user = new User(userParams);
        User.register(user, req.body.password, (error,user) => {
            if(user){
                //req.flash("success", "create sucessfully");
                res.locals.redirect = "mypage";
                res.locals.user = user;
                next();
            }
            else{
                console.log('error');
                res.locals.redirect = "signUp_main";
                next();
            }
        });
    }
    catch(error){
        console.log('error!')
        res.locals.redirect="/";
        next(error);
    };
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath == undefined) res.redirect(redirectPath);
    else next();
  },
  show: async (req, res, next) => {
    let userId = req.params.id;
    try {
      let  user = await User.findByPk(userId);
      res.user = user;
      next();
    } catch (error) {
      console.log("error!");
      next(error);
    }
  },
  showView: async (req, res) => {
      console.log(res.locals);
    res.render("user/show"); // 주소 다시 입력
  },
  edit: async (req, res, next) => {
    let userId = req.params.id;
    try {
      let user = await User.findByPk(userId);
      res.render =
        ("user/edit",
        {
          user: userId,
        });
    } catch (error) {
      console.log("error");
      next(error);
    }
  },
  update: async (req, res, next) => {
    let userId = req.params.id,
      userParams = getUserParams(req.body);
    console.log(userParams);
    try {
      let user = await User.findByPkAndUpdate(
        userId,
        userParams
      );
      res.locals.redirect = "/user/${userId}";
      res.locals.user = user;
      next();
    } catch (error) {
      console.log("Error");
      next(error);
    }
  },
  delete: async (req, res, next) => {
    let userId = req.params.id;
    try {
      let user = await User.findByPkAndRemove(userId);
      res.locals.redirect = "/users";
      next();
    } catch (error) {
      console.log("Error");
      next(error);
    }
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
                //next();
            }
            else{
              console.log("불일치");
                res.redirect("/login_main");
                next();
            }
        } else{
            res.redirect("/login_main");
            next();
        }
    }catch(err){
        console.log('error!나요');
        next(err);
    };
    },


    sendMail: async (req, res, next) =>{
      try{
        const reademailaddress = req.body.EA;
        number = randomNumber(111111, 999999);
        
        await sendEmail(reademailaddress, number);
          console.log("인증메일 전송");
          res.send({
            number:number
          });    

      }catch(err){
        res.end();
        console.error(err);
        next(err);
      };
    },
        

    emailCert : async (req,res,next)=>{
      try{
        let isAuthedEA=req.body.isAuthedEA;
        const CEA = req.body.CEA;

        if(CEA==number){
          console.log("인증 성공");
          isAuthedEA=true;
        }
        else
          console.log("인증 실패");
             
        res.send(isAuthedEA);

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
    
        const userEmail = await db.userTBL.findAll({
          attributes: ['email'],
          where: {id : id},
          raw:true
        });    
        if (userEmail)
          if (userEmail[0].email == email)
            isValidId=true;
          
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
      res.render("mypage_pw");
    },

    checkPw: async (req,res, next) => {
      console.log("로그인된 아이디는 "+req.session.userId);
      try{
        const inputPw = req.body.password;
        console.log(inputPw);

        const user = await db.userTBL.findOne({
          where: {id: req.session.userId}
        })

        if(user){
            let passwordMatch = await user.passwordComparison(inputPw, user.password);
            console.log(passwordMatch);

            if(passwordMatch){
              console.log("ok실행");
              res.send({
                result:"ok"
              })
            } else{
              console.log("fail실행");
            res.send({
              result:"fail"
            })
          }
      }

    } catch(err){ console.error(err);
      next(err);
      res.end();
    }   
    },

    applyNewPw : async function(req,res,next) {
      try{
        const newPw=req.body.password;
        let user = await db.userTBL.findOne({
          where: {id : req.session.userId}
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
        res.end();
      }
    },

    
    changeEmail : (req,res) =>{
      res.render("mypage_email");
    },

    checkEmail : (req,res) =>{
      
    }



  }