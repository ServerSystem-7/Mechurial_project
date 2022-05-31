const express = require("express"),
  app = express(),
  router = express.Router(),
  errorController = require("./controllers/errorController"),
  homeController=require("./controllers/homeController"),
  signUpController=require("./controllers/signUpController"),
  enrollController = require("./controllers/enrollController"),
  layouts = require("express-ejs-layouts"),
  methodOverride = require("method-override");
  
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

router.get("/", homeController.homePage);
router.get("/enroll", enrollController.showEnroll);
router.get("/enrollManagement", enrollController.manageEnroll);
router.get("/enrollEdit", enrollController.showEnroll);

router.get("/serviceInfo", homeController.showserviceInfo);

router.get("/signUp_terms", signUpController.signUp_terms);
router.get("/signUp", signUpController.signUp_main);
 // router.post("/signUp/create", signUpController.signUp_create);
router.post("/signUp_emailAuth", signUpController.emailAuth);
router.post("/signUp_emailCert", signUpController.emailCert);
router.get("/signUp_complete", signUpController.signUp_complete);

router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

app.use("/", router);
app.listen(app.get("port"), () => {
  console.log(`Server running at ${app.get("port")}`);
});