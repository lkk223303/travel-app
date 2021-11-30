let express = require("express");
let app = express();
let fortune = require("./lib/fortune");

// 設定handlebars view 引擎
let handlebars = require("express3-handlebars").create({
  defaultLayout: "main",
});
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);

app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/about", (req, res, next) => {
  let randomFortune = fortune.getFortune();
  res.render("about", { fortune: randomFortune });
});

// 404 全部抓取處理程式（中介軟體）
app.use((req, res, next) => {
  res.status(404);
  res.render("404");
});
// 500錯誤處理程式（中介軟體）
app.use((req, res, next) => {
  res.status(500);
  res.render("500");
});

app.use(express.static(__dirname + "/public"));

// // 自訂500
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.type("text/plain");

//   res.send("500-Server-Error");
// });

app.listen(app.get("port"), () => {
  console.log(
    "Express running on http://localhost:" +
      app.get("port") +
      " ;press Ctrl+C to end"
  );
});
