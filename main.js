const express = require("express"),
  app = express(),
  router = express.Router(),
  errorController = require("./controllers/errorController"),
  homeController=require("./controllers/homeController"),
  signUpController=require("./controllers/signUpController"),
  enrollController = require("./controllers/enrollController"),
  // subscriberController = require("./controllers.subscribersController"),
  layouts = require("express-ejs-layouts"),
  methodOverride = require("method-override"),
  // cookieParser = require("cookie-parser"),
  user = require("./models/user");

app.set("port", process.env.PORT || 80);
app.set("view engine", "ejs");
app.use("/public", express.static(__dirname + "/public"));

router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
);
router.use (
  express.urlencoded({
    extended : false
  })
);
router.use(layouts);
router.use(express.static("public"));
router.use(express.json());

// app.use(cookieParser());

router.get("/", homeController.homePage);
router.get("/enroll", enrollController.showEnroll);
router.get("/enrollManagement", enrollController.manageEnroll);
router.get("/enrollEdit", enrollController.showEnroll);

router.get("/signUp_terms", signUpController.signUp_terms);
router.get("/signUp", signUpController.signUp_main);
 // router.post("/signUp/create", signUpController.signUp_create);
router.post("/signUp_emailAuth", signUpController.emailAuth);
router.post("/signUp_emailCert", signUpController.emailCert);
router.get("/signUp_complete", signUpController.signUp_complete);

// app.get("/signUp_main", homeController.showEnrollManage);
app.get("/serviceInfo", homeController.showserviceInfo);
app.get("/logIn_main", homeController.showLogin);
app.get("/mypage_main", homeController.showMypage);

router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

app.use("/", router);
app.listen(app.get("port"), () => {
  console.log(`Server running at ${app.get("port")}`);
});
