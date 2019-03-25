//DEPENDANCIES
var cheerio = require("cheerio");
var axios = require("axios");
var express = require("express");
var morgan = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
// const dotenv = require('dotenv'); //!!!!
require('dotenv').config();
var db = require("./models");

// Sets up the Express App & link middleware
var app = express();
app.use(morgan('combined'))
var PORT = process.env.PORT || 3000;

// CONFIGURE MIDDLEWARE
app.use(morgan("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Sets up the Express app to handle data parsing (if not, req.body is always undefined)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Express view engine (don't know if I need this)
// app.engine('handlebars', expressHand({ defaultLayout: 'main' }));
// app.set('view engine', 'handlebars');



// CONNECTION FOR MONGO DB !!! (format)
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/redditdb";
var MONGODB_URI = process.env.MONGODB_URI || 
// mongoose.connect();
mongoose.connect("mongodb://localhost/redditdb", { useNewUrlParser: true });


// /ROUTES (./ because we're in the same directory)
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/layouts/index.html');
});
app.get("/saved", function(req, res) {
  res.sendFile(path.join(__dirname, "/views/layouts/saved.html"));
});

// ROUTES TO SCRAPE
app.get("/scrape", function (req, res) {
  // An empty array to save the data that we'll scrape (moved up to be within scope)
  var results = [];
  // First, we grab the body of the html with axios
  axios.get("https://old.reddit.com/r/webdev/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    // With cheerio, find each p-tag with the "title" class
      var incrementor = 0;
    $("article").each(function (i, element) {
      // Save the text of the element in a "title" variable
      var title = $(element).text();
      // var story = $(element).text();
      // In the currently selected element, look at its child elements (i.e., its a-tags),
      // then save the values for any "href" attributes that the child elements may have
      var link = $(element).children().attr("href");
      // Save these results in an object that we'll push into the results array we defined earlier
      results.push({
        title: title,
        link: link
      });
      if (title && link) { 
    
    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results); //go to my node terminal server
    //   res.send(results);

  //CREATE NEW ARTICLE
  // Create a new Article using the `result` object built from scraping
  db.Article.create(results)
    .then(function (Articledb) {
      incrementor++;
      console.log(incrementor + "new scrape added ");
      //         // View the added result in the console
      //         console.log(redditdb);
      //       })
      //       .catch(function(err) {
      //         // If an error occurred, log it
      //         console.log(err);
      //       });
      // // Send a message to the client
      //   res.json(results);
      //   });
      
      res.json(Articledb);
    })
    .catch(function (err) {
      res.json(err);
    
    });
  }});
// redirect to client
  res.sendFile(path.join(__dirname, '/views/layouts/index.html'));
    });
  });


// ROUTE FOR GETTING ALL ARTICLES FROM THE DB
app.get("/articles", function (req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({})
    .then(Articledb => res.json(Articledb))
    .catch(function (err) {
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with its note
app.get("/articles/:id", function (req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(Articledb => res.json(Articledb));
})
// Error
    .catch(function (err) {
      res.json(err);
    });

  
// Route for grabbing an article by ID
app.put("/articles/:id", function (req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Article.update({ _id: req.params.id}, {$set: {isSaved: true}})
    .then(Articledb) 
    res.json(Articledb);
  // .catch(function (err) {
  //   res.json(err);
  // });
})
.catch(function (err) {
  res.json(err);
});
    

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Note.create(req.body)
    .then(dbNote => db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote.id }, { new: true })); 
     })
    .then(Articledb => res.json(Articledb))
  // .catch(function (err) {
  //   res.json(err);
  // });
  .catch(function(err) {
    res.json(err);
});

// Deleting an article
app.delete("/articles/:id", function(req, res) {
  db.Article.remove({ _id: req.params.id})
  .then(Articledb => res.json(Articledb))
  })
  .catch(function(err) {
    res.json(err);
  });


// Listener
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});