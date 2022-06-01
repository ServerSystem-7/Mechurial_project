const express = require("express"),
    app = express(),
    homeController = require("./controllers/homeController"),
    errorController = require("./controllers/errorController"),
    pageController = require("./controllers/pageController"),
    layouts = require("express-ejs-layouts"),
    db = require("./models/index");

db.sequelize.sync();
const Page = db.page;
const page1 = {
    url: "https://www.geeksforgeeks.org/how-to-create-hash-from-string-in-javascript/"
};
const page2 = {
    url: "https://developer.mozilla.org/ko/docs/Web/API/setTimeout"
};

// define create
let test_create = async () => {
    try {
        await Page.create(page1);
        await Page.create(page2);
    } catch (err) {
        console.log(err)
    }
}
// define find
let test_find = async () => {
    let myQuery = await Page.findAll()
    console.log(myQuery);
}

// define test
let test = async () => {
    // await test_create();
    await test_find();
}
test();

// set port, ejs
app.set("port", process.env.PORT || 80);
app.set("view engine", "ejs");

// use public, layouts, urlencoded, json,
app.use(express.static("public"));
app.use(layouts)
app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(express.json());

// get
app.get("/page", pageController.getAllPages);  // 보여주기용. 실제로는 get X
app.get("/name", homeController.respondWithName);
app.get("/items:vegetable", homeController.sendReqParam);

app.post("/", (req, res) => {
    console.log(req.body);
    console.log(req.query);
    res.send("POST Successful");
})

app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
    console.log("listening");
})