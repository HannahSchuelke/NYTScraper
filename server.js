//DEPENDANCIES
var cheerio = require("cheerio");
var axios = require("axios");
var express = require("express");
var morgan = require("morgan");
var mongoose = require("mongoose");
// var path = require("path");
require('dotenv').config();
var db = require("./models");

// SET UP EXPRESS APP AND LINK MIDDLEWARE
var app = express();
app.use(morgan('combined'))
var PORT = process.env.PORT || 3000;

// CONFIGURE MIDDLEWARE
app.use(morgan("dev"));
// PARSE REQUEST BODY AS A JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// MAKE PUBLIC A STATIC FOLDER
app.use(express.static("public"));

// SETS UP EXPRESS APP TO HANDLE DATA PARSING (if not, req.body is always undefined)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CONNECTION FOR MONGO DB (local format)
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsdb";
// mongoose.connect("mongodb://localhost/newsdb", { useNewUrlParser: true });

// CONNECTION FOR MONGO DB (heroku format)
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsdb";
mongoose.connect(MONGODB_URI);


// /ROUTES (./ because we're in the same directory)
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/layouts/index.html');
});

// ROUTES TO SCRAPE
app.get("/scrape", function (req, res) {
  // An empty array to save the data that we'll scrape (moved up to be within scope)
  var results = [];
  // First, we grab the body of the html with axios
  axios.get("https://www.nytimes.com/section/world").then(function (response) {
    console.log("scrape start ===============================")
    var $ = cheerio.load(response.data);
    var newsArr = [];
    // scraping headline, link, summary, picture, date
    $("#stream-panel").find("li").each(function (i, element) {
      // source = source.toUpperCase()
      var headline = $(element).find("h2").text()
      var link = $(element).find("a").attr("href")
      var summary = $(element).find("p").text()
      var n = summary.search(".By")
      summary = summary.slice(0, n + 1)

      // SAVE RESULTS INTO OBJEXT THAT WILL BE PUSHED INTO AN ARRAY
      var news = {
        // source: "NEW YORK TIMES " + source,
        headline: headline,
        link: "https://www.nytimes.com" + link,
        summary: summary,
      };
      // push a specific piece of news into an Array
      newsArr.push(news)
    })
    console.log(newsArr)
    // save the number of articles in a variable
    var amount = newsArr.length

    // PUSH ARRAY OF NEWS OBJECTS INTO ARTICLE DATABASE ???
    db.Article.insertMany(newsArr, { "ordered": false }).then(function (dbNews) {
      let message = "Get " + amount + " news articles and " + amount + " different ones added!"
      db.Article.find({})
        .then(Articledb => {
          let data = {
            message: message,
            Articledb: Articledb
          }
          res.json(data)
        })
        .catch(function (err) {
          res.json(err);
        });
    })
  })
});

// ROUTE FOR GETTING ALL ARTICLES FROM THE DB
app.get("/articles", function (req, res) {
  res.sendStatus(200)
});

// ROUTE FOR GRABBING AN ARTICLE BY ID AND POPULATE IT WITH ITS NOTE
app.get("/articles/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (Articledb) {
      res.json(Articledb);
    })
    // Error
    .catch(function (err) {
      res.json(err);
    });
});

// ROUTE FOR GRABBING AN ARTICLE BY ID
app.put("/articles/:id", function (req, res) {
  db.Article.update({ _id: req.params.id }, { $set: { isSaved: true } })
    .then(function (Articledb) {
      res.json(Articledb);
    })
    .catch(function (err) {
      res.json(err);
    });

  // DELETING AN ARTICLE
  app.delete("/articles/:id", function (req, res) {
    db.Article.remove({ _id: req.params.id })
      .then(Articledb => res.json(Articledb))
  })
    .catch(function (err) {
      res.json(err);
    });
});

// ROUTE FOR SAVING/UPDATING AN ARTICLES NOTE
app.post("/articles/:id", function (req, res) {
  db.Note.create(req.body)
    .then(dbNote => db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: true } }, { new: true }))
    .then(Articledb => res.json(Articledb))
    .catch(function (err) {
      res.json(err);
    });
})

// ROUTE FOR GETTING ALL NOTES FROM THE DB
app.get("/notes/:id", function (req, res) {
  db.Note.find({ newsId: req.params.id })
    // .populate("note")
    .then(function (data) {
      res.json(data);
    })
    // Error
    .catch(function (err) {
      res.json(err);
    });
});

// LISTENER
// app.listen(PORT, function () {
//   console.log("App listening on PORT " + PORT);
// });

// LISTENER TO GET MONGOOSE TO CONNECT TO HEROKU
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});