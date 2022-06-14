const express = require("express"),
  app = express(),
  router = express.Router(),
  errorController = require("./controllers/errorController"),
  homeController=require("./controllers/homeController"),
  signUpController=require("./controllers/signUpController"),
  registerController = require("./controllers/registerController"),
  userController=require("./controllers/userController"),
  layouts = require("express-ejs-layouts"),
  session = require("express-session"),
  // cookieParser = require("cookie-parser"),
  db = require('./models/index');

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use("/public", express.static(__dirname + "/public"));

router.use (
  express.urlencoded({
    extended : false
  })
);
router.use(layouts);
router.use(express.static("public"));
router.use(express.json());

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

// app.use(cookieParser());

db.sequelize.sync({ alter: false })
  .then(() => {
	  console.log('데이터베이스 연결 성공.');
  })
  .catch((error) => {
      console.error(error);
});


router.get("/", homeController.homePage);
router.get("/register/new", registerController.new);
router.post("/register/create", registerController.create, registerController.redirectView);
router.get("/registerManagement", registerController.manage, registerController.manageView);
router.post("/registerManagement/:registerId/delete", registerController.delete, registerController.redirectView);
router.get("/registerManagement/:registerId/edit", registerController.edit); // POST로 변경해야 함
router.post("/registerManagement/:registerId/update", registerController.update, registerController.redirectView);

router.get("/signUp_terms", signUpController.signUp_terms);
router.get("/signUp", signUpController.signUp_main);
router.post("/signUp/idChk", signUpController.idChk);
router.post("/signUp/create", signUpController.createUser);
router.post("/signUp/sendmail", signUpController.sendMail);
router.post("/signUp/emailcert", signUpController.emailCert);
router.get("/signUp/complete", signUpController.signUp_complete);

router.get("/logIn_main", userController.login);
router.post("/logIn_main", userController.authenticate);
router.get("/logOut_main", userController.logout);

// 회원정보 관련 라우터
// 1. 아이디 찾기 관련 라우터
router.get("/search_id", userController.searchid);
router.post("/search_id/sendmail", userController.sendMail);
router.post("/search_id/emailcert", userController.emailCert);
router.post("/id_search_1", userController.authenticate);

// 2. 비밀번호 찾기 관련 라우터
router.get("/search_pw", userController.searchPw);
router.post("/search_pw/sendmail", userController.sendMail);
router.post("/search_pw", userController.checkIdEmail);
// 3. 비밀번호 변경 관련 라우터
router.get("/mypage_pw",userController.changePW);
router.post("/mypage_pw/checkpw",userController.checkPw);
router.post("/mypage_pw/changepw",userController.applyNewPw);
// 4. 이메일 변경 관련 라우터
router.get("/mypage_email",userController.changeEmail);
router.post("/mypage_pw/checkemail",userController.checkEmail);
// router.post("/mypage_pw/changeemail",userController.applyNewEmail);

app.get("/serviceInfo", homeController.showserviceInfo);
app.get("/logIn_main", homeController.showLogin);
app.get("/mypage_main", homeController.showMypage);

router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

app.use("/", router);
app.listen(app.get("port"), () => {
  console.log(`Server running at ${app.get("port")}`);
});

// app.listen(app.get("port"), () => {
//   console.log(`Server running at http://localhost:${app.get("port")}`);
// });