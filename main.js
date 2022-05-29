const express = require("express"),
  app = express(),
  router = express.Router(),
  //homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController"),
  enrollController = require("./controllers/enrollController"), //등록 컨트롤러
  layouts = require("express-ejs-layouts");
  methodOverride = require("method-override");
  
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 80);
app.use(
    express.urlencoded({
      extended: false
    })
  );
app.use(express.json());
app.use(layouts);
app.use(express.static("public"));
  
app.get("/", (req, res) => {      //기본 메인페이지 이동
  res.render("index");
});
// 생성해야 할 controllers : 회원가입 / 등록 / 회원정보설정 / 

router.get("/enroll", enrollController.showEnroll);   // 등록 받아오기
router.get("/enrollManagement", enrollController.manageEnroll);   // 등록 받아오기
router.get("/enrollEdit", enrollController.showEnroll);   // 등록 받아오기

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});

router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
);

