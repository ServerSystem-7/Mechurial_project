const express = require("express"),
  app = express(),
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  user = require("./models/user"),
  router = express.Router();
//subscriberController = require("./controllers.subscribersController");

// const cookieParser = require("cookie-parser");
// app.use(cookieParser());

app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);
app.use(
  express.urlencoded({
    extended: false,
  })
);

// app.use(layouts);
app.use(express.json());
app.use("/public", express.static(__dirname + "/public"));
app.get("/", homeController.homePage);

app.get("/enroll", homeController.showSignUp);

app.get("/signUp_main", homeController.showEnrollManage);
app.get("/enrollManage", homeController.showLogin);
app.get("/serviceInfo", homeController.showserviceInfo);
app.get("/logIn_main", homeController.showLogin);
app.get("/mypage_main", homeController.showMypage);

// app.get("/mypage", user.getInfo(), (req, res, next) => {
//   res.render("mypage_main", { user: req.data });
// });

// app.get("/enroll", subscriberController.create());

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
