const { session } = require("passport");

const db = require("../models/index"),
passport = require("passport"),
cookieParser = require("cookie-parser"),

  User = db.userTBL,
  Register = db.registerTBL,
  
  getUserParams = (body) => {
    return {
      id: body.id,
      email: body.email,
      password: body.password
    };
  };
  
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
    mypage: async(req, res, next) => {  
      if(req.session.is_logined){
          const userid = req.session.userId;
          try {
            User.findByPk(userid).then((user) => {
              res.render("mypage_main",{user});
            })
          }catch (error) {
            console.log("error!");
          }
      }
      else{
          res.render("logIn_main");
      }
  },
  // mypageView: (req, res) => {
  //   res.render("mypage_main", req.userinfo);
  // },
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
    let userId = req.session.userId;
    try {
      console.log(userId, "leave our site");
      let user_regi = Register.findAll({where: {userId : userId}})
      let user_regiId = user_regi.registerId;
      Register.findByPkAndRemove(user_regiId);
      User.findByPkAndRemove(userId);
    
      res.render("mainpage");
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
        console.log('error!');
        next(err);
    };
    },
    
    findId: async (req, res, next) => {
      let userEmail = req.params.email;
      try {
        let  user = await User.findByPk(userEmail);
        res.user = user;
        if(user){
         
      //

        }
        next();
      } catch (error) {
        console.log("error!");
        next(error);
      }
    },

    searchid_auth: async (req, res, next) =>{
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
        };};

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
          const CEA = req.body.CEA;
          console.log(number);

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
}
// authenticate: (req, res, next) => {
//   passport.use((
//     function(id, password, done){
//       console.log(1);
//       console.log('Local', id, password);

//       var user = db.get('users').find({
//         id: id,
//         password: password
//       }).value();
//       if(user){
//         return done(null, user, {
//           message: 'welcome'
//         });
//       }else {
//         return done(null, false, {
//           message: 'incorrect user information'
//         });
//       }
//     }
//   )); 
// },

// module.exports = {
//   authenticate: (req, res, next) => {
//     passport.use((
//       function(id, password, done){
//         console.log('Local', id, password);
  
//         var user = db.get('users').find({
//           id: id,
//           password: password
//         }).value();
//         if(user){
//           return done(null, user, {
//             message: 'welcome'
//           });
//         }else {
//           return done(null, false, {
//             message: 'incorrect user information'
//           });
//         }
//       }
//     )); 
//   }
// }
