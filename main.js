const express = require("express"),
  app = express(),
  router = express.Router(),
  errorController = require("./controllers/errorController"),
  homeController=require("./controllers/homeController"),
  signUpController=require("./controllers/signUpController"),
  registerController = require("./controllers/registerController"),
  userController=require("./controllers/userController"),
  myPageController=require("./controllers/myPageController"),
  session = require("express-session"),
  crawling = require("./crawl_main"),
  db = require('./models/index');

app.set("port", process.env.PORT || 80);
app.set("view engine", "ejs");
app.use("/public", express.static(__dirname + "/public"));

router.use (
  express.urlencoded({
    extended : false
  })
);

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


db.sequelize.sync({ alter: false })
  .then(() => {
	  console.log('데이터베이스 연결 성공.');
  })
  .catch((error) => {
      console.error(error);
});


router.get("/", homeController.homePage);
// 등록 관련 라우터
router.get("/register/new", registerController.new);
router.post("/register/create", registerController.create, registerController.redirectView);
router.get("/registerManagement", registerController.show);
router.post("/registerManagement/:registerId/delete", registerController.delete, registerController.redirectView);
router.get("/registerManagement/:registerId/edit", registerController.edit); 
router.post("/registerManagement/:registerId/update", registerController.update, registerController.redirectView);

// 회원가입 관련 라우터
router.get("/signUp/terms", signUpController.signUp_terms);
router.get("/signUp", signUpController.signUp_main);
router.post("/signUp/idChk", signUpController.idChk);
router.post("/signUp/create", signUpController.createUser);
router.post("/signUp/sendmail", signUpController.sendMail);
router.post("/signUp/emailcert", signUpController.emailCert);
router.get("/signUp/complete", signUpController.signUp_complete);

// 로그인 관련 라우터
router.get("/logIn_main", userController.login);
router.post("/logIn_main", userController.authenticate);
router.get("/logOut_main", userController.logout);

// 회원정보 관련 라우터
router.get("/mypage_main",myPageController.enterMypage);
// 1. 아이디 찾기 관련 라우터
router.get("/search_id", userController.searchid);
router.post("/search_id/sendmail", userController.sendMail_cerNum);
router.post("/search_id/emailcert", userController.checkCerNum, userController.sendMail_id);
router.post("/id_search_1", userController.authenticate);

// 2. 비밀번호 찾기 관련 라우터
router.get("/search_pw", userController.searchPw);
router.post("/search_pw/sendmail", userController.sendMail_cerNum);
router.post("/search_pw", userController.checkIdEmail);
router.get("/search_pw/new", userController.showInputNewPw)

// 3. 회원정보 조회를 위한 비밀번호 확인
router.get("/mypage/check", myPageController.showCheckPw);

// 4. 비밀번호 변경 관련 라우터
router.get("/mypage_pw",userController.changePW);
router.post("/mypage/checkpw",myPageController.checkPw);
router.post("/mypage/changepw",userController.applyNewPw);

// 5. 이메일 변경 관련 라우터
router.get("/mypage_email",userController.showChangeEmail);
router.post("/mypage/checkemail",userController.checkNewEmail);
router.post("/mypage/emailcert",userController.checkCerNum, userController.cerNumOk);
router.post("/mypage/changemail",userController.applyNewEmail);

//6. 회원 탈퇴 라우터
router.post("/mypage_main", userController.deleteUser);

app.get("/serviceInfo", homeController.showserviceInfo);
app.get("/logIn_main", homeController.showLogin);

router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

app.use("/", router);
app.listen(app.get("port"), () => {
  console.log(`Server running at ${app.get("port")}`);
});

// app.listen(app.get("port"), () => {
//   console.log(`Server running at http://localhost:${app.get("port")}`);
// });