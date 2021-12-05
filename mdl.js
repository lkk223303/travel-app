var express = require("express");
var app = express();
var fortune = require("./lib/fortune");

// 設定handlebars view 引擎
var handlebars = require("express3-handlebars").create({
  defaultLayout: "main",
});
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);

app.use(function (req, res, next) {
  res.locals.showTests =
    app.get("env") !== "production" && req.query.test === "1";
  next();
});

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res, next) {
  res.render("home");
});

app.get("/about", function (req, res, next) {
  res.render("about", {
    fortune: fortune.getFortune(),
    pageTestScript: "/qa/tests-about.js",
  });
});

app.get("/tours/hood-river", function (req, res) {
  res.render("tours/hood-river");
});
app.get("/tours/oregon-coast", function (req, res) {
  res.render("tours/oregon-coast");
});
app.get("/tours/request-group-rate", function (req, res) {
  res.render("tours/request-group-rate");
});

// 404 全部抓取處理程式（中介軟體）
app.use(function (req, res, next) {
  res.status(404);
  res.render("404");
});
// 500錯誤處理程式（中介軟體）
app.use(function (req, res, next) {
  res.status(500);
  res.render("500");
});

// // 自訂500
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.type("text/plain");

//   res.send("500-Server-Error");
// });

app.listen(app.get("port"), function () {
  console.log(
    "Express running on http://localhost:" +
      app.get("port") +
      " ;press Ctrl+C to end"
  );
});
