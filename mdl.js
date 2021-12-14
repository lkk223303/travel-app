var express = require("express");
var app = express();
var fortune = require("./lib/fortune");

// 設定handlebars view 引擎
var handlebars = require("express3-handlebars").create({
  defaultLayout: "main",
  helpers: {
    section: function (name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    },
  },
});
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

// 預設情況下，開發模式的視圖緩存停用，產品模式下會啟用，自行啟用視圖緩存⬇️
// app.set("view cache", true);

app.set("port", process.env.PORT || 3000);

app.use(function (req, res, next) {
  res.locals.showTests =
    app.get("env") !== "production" && req.query.test === "1";
  next();
});

function getWeatherData() {
  return {
    locations: [
      {
        name: "Portland",
        forecastUrl: "http://www.wunderground.com/US/OR/Portland.html",
        iconUrl: "http://icons-ak.wxug.com/i/c/k/cloudy.gif",
        weather: "Overcast",
        temp: "54.1 F (12.3 C)",
      },
      {
        name: "Bend",
        forecastUrl: "http://www.wunderground.com/US/OR/Bend.html",
        iconUrl: "http://icons-ak.wxug.com/i/c/k/partlycloudy.gif",
        weather: "Partly Cloudy",
        temp: "55.0 F (12.8 C)",
      },
      {
        name: "Manzanita",
        forecastUrl: "http://www.wunderground.com/US/OR/Manzanita.html",
        iconUrl: "http://icons-ak.wxug.com/i/c/k/rain.gif",
        weather: "Light Rain",
        temp: "55.0 F (12.8 C)",
      },
    ],
  };
}

app.use(express.static(__dirname + "/public"));
app.use(require("body-parser")());

app.use(function (req, res, next) {
  if (!res.locals.partials) res.locals.partials = {};
  res.locals.partials.weather = getWeatherData();
  next();
});

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
app.get("/jquerytest", function (req, res) {
  res.render("jquery-test");
});
app.get("/nursery-rhyme", function (req, res) {
  res.render("nursery-rhyme");
});
app.get("/data/nursery-rhyme", function (req, res) {
  res.json({
    animal: "squirrel",
    bodyPart: "tail",
    adjective: "bushy",
    noun: "heck",
  });
});

app.post("/process", function (req, res) {
  console.log(req.body);
});

//請求標頭 請求物件的headers特性，內含瀏覽器傳送的資訊
app.get("/headers", function (req, res) {
  res.set("Content-Type", "text/plain");
  var s = "";
  for (var name in req.headers) s += name + " : " + req.headers[name] + "\n";
  res.send(s);
});

// // Format
// app.get("/format", function (req, res) {
//   res.format({
//     "text/html": function () {
//       res.send("<p>hey</p>");
//     },

//     "appliation/json": function () {
//       res.send({ message: "hey" });
//     },
//   });
// });

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
