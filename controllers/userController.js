const db = require("../models/index"),
passport = require("passport"),
cookieParser = require("cookie-parser"),

  User = db.usertbl,
  getUserParams = (body) => {
    return {
      id: body.id,
      email: body.email,
      password: body.password
    };
  };
module.exports = {
    login: (req, res, next)=>{
      res.render("logIn_main")
    },
    searchid: (req, res, next)=>{
      res.render("search_id")
    },
    logout: (req, res, next) => {
        req.session.distroy;
        res.clearCookie("sid");
        res.redirect('logIn_main');
    },
    // authenticate: passport.authenticate("local", {
    //   failureRedirect: '/login_main',
    //   //failureFlash : "failed to login",
    //   successRedirect: '/',
    //   //successFlash:"loggin!"
    //   }),

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
    try{
        let user = new User(userParams);
        User.register(user, req.body.password, (error,user) => {
            if(user){
                req.flash("success", "create sucessfully");
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
        let user = await User.findOne({ where: {id: req.body.id}})
        console.log(user);
        if(user){
            let passwordMatch = await user.passwordComparison(req.body.password, user.password);
            if(passwordMatch){
                console.log("일치");
                req.session.id = req.body.id;
                req.session.is_logined = true;
                //res.locals.user = user;
                res.redirect("/");
                //next();
            }
            else{
              console.log("불일치");
                //req.flash("error","Incorrect Password");
                res.redirect("/login_main");
                next();
            }
        } else{
            //req.flash("error","User account not found");
            res.redirect("/login_main");
            next();
        }
    }catch(err){
        console.log('error!나요');
        next(err);
    };
    },
    searchid_auth: (req, res) =>{

    },
  }