const express = require("express"),
  app = express(),
  router = express.Router(),
  errorController = require("./controllers/errorController"),
  homeController=require("./controllers/homeController"),
  signUpController=require("./controllers/signUpController"),
  registerController = require("./controllers/registerController"),
  layouts = require("express-ejs-layouts"),
  // cookieParser = require("cookie-parser"),
  db = require('./models/index');

app.set("port", process.env.PORT || 80);
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

// app.use(cookieParser());

/**/
db.sequelize.sync({ alter: true })
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
router.get("/register/:id/edit", registerController.edit);
router.post("/register/:id/update", registerController.update, registerController.redirectView);

router.get("/signUp_terms", signUpController.signUp_terms);
router.get("/signUp", signUpController.signUp_main);
router.post("/signUp/create", signUpController.createUser);
router.post("/signUp_emailAuth", signUpController.emailAuth);
router.post("/signUp_emailCert", signUpController.emailCert);
router.get("/signUp/complete", signUpController.signUp_complete);

app.get("/serviceInfo", homeController.showserviceInfo);
app.get("/logIn_main", homeController.showLogin);
app.get("/mypage_main", homeController.showMypage);

router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

app.use("/", router);
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
