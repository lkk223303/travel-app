var express = require("express");
var app = express();
var fortune = require("./lib/fortune");
var formidable = require("formidable");

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

app.get("/newsletter", function (req, res) {
  // 我們之後會學習ＣＳＲＦ，現在只提供一個虛擬值
  res.render("newsletter", { csrf: "CSRF token goes here" });
});

app.post("/process", function (req, res) {
  // console.log("Form (from querystring): " + req.query.form);
  // console.log("CSRF token (from hidden form field): " + req.body._csrf);
  // console.log("Name (from visible form field): " + req.body.name);
  // console.log("Email (from visible form field): " + req.body.email);

  if (req.xhr || req.accepts("json,html") === "json") {
    // 如果有錯誤的話，我們會傳送 {error:'error description'}
    res.send({ success: true });
  } else {
    // 如果有錯誤的話，會重新導向至一個錯誤網頁
    res.redirect(303, "/thank-you");
  }
});

app.get("/contest/vacation-photo", function (req, res) {
  var now = new Date();
  res.render("contest/vacation-photo", {
    year: now.getFullYear(),
    month: now.getMonth(),
  });
});

app.post("/contest/vacation-photo/:year/:month", function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    if (err) return res.redirect(303, "/error");
    // 可以看到前端打過來帶的參數
    console.log(req.params);
    // 接收到的表單資訊
    console.log("received fields: ");
    console.log(fields);
    // 接收到的檔案資訊
    console.log("received files: ");
    console.log(files);
    res.redirect(303, "/thank-you");
  });
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
