const express = require("express"),
  app = express(),
  router = express.Router(),
  errorController = require("./controllers/errorController"),
  homeController=require("./controllers/homeController"),
  signUpController=require("./controllers/signUpController"),
  registerController = require("./controllers/registerController"),
  layouts = require("express-ejs-layouts"),
  // cookieParser = require("cookie-parser"),
  userController = require("./controllers/userController"),
  session = require("express-session"),
  db = require('./models/index');

router.use(express.static("public"));
router.use(express.json());

app.set("port", process.env.PORT || 80);
app.set("view engine", "ejs");

app.use("/public", express.static(__dirname + "/public"));

router.use (
  express.urlencoded({
    extended : false
  })
);
db.sequelize.sync({ alter: false })
  .then(() => {
	  console.log('데이터베이스 연결 성공.');
  })
  .catch((error) => {
      console.error(error);
  });


app.use(
  session({
    key: 'sid',
    secret: "secret",
    cookie: {
      httpOnly: true,
      maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false,
    nickname: 'id'
  })
); 

/*var passport = require('passport'), 
  LocalStrategy = require ('passport-local').Strategy; //세션을 이용해야 하니 세션 아래에 선언

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, done){
  console.log('serializeUser', user);
  done(null,user.id);
});

passport.deserializeUser(function(id, done){
  console.log('deserializeUser', id);
  done(null,user.id);
  done(null, authData)
});passport 사용*/

router.get("/", homeController.homePage);
router.get("/register/new", registerController.new);
router.post("/register/create", registerController.create, registerController.redirectView);
//router.get("/registerManagement", registerController.manage, registerController.showView);
router.get("/registerManagement", registerController.show);
router.post("/registerManagement/:registerId/delete", registerController.delete, registerController.redirectView);
router.get("/register/:id/edit", registerController.edit);
router.post("/register/:id/update", registerController.update, registerController.redirectView);

router.get("/signUp_terms", signUpController.signUp_terms);
router.get("/signUp", signUpController.signUp_main);
router.post("/signUp/create", signUpController.createUser);
router.post("/signUp_emailAuth", signUpController.emailAuth);
router.post("/signUp_emailCert", signUpController.emailCert);
router.get("/signUp/complete", signUpController.signUp_complete);

router.get("/logIn_main", userController.login);
router.post("/logIn_main", userController.authenticate);
router.get("/logOut_main", userController.logout);

router.get("/mypage_main", userController.mypage);
router.post("/mypage_main", userController.delete);

router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

app.use("/", router);
app.listen(app.get("port"), () => {
  console.log(`Server running at https://localhost:${app.get("port")}`);
});
