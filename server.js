//DEPENDANCIES
var cheerio = require("cheerio"); 
var axios = require("axios"); 
var express = require("express");
var morgan = require("morgan");
var mongoose = require("mongoose");
var expressHand = require("express-handlebars");
const dotenv = require('dotenv'); //!!!!
// Requiring Article model
// var Article = require('./models');
// Requiring the `User` model for accessing the `users` collection
// var Note = require("./models"); //!!!
var db = require("./models");

// Sets up the Express App & link middleware
var app = express();
app.use(morgan('combined'))
var PORT = process.env.PORT || 3000;

// CONFIGURE MIDDLEWARE
// Use morgan logger for logging requests
app.use(morgan("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Sets up the Express app to handle data parsing (if not, req.body is always undefined)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Express view engine
app.engine('handlebars', expressHand({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



// Connect to the Mongo DB 
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/redditdb"
mongoose.connect(MONGODB_URI);
// mongoose.connect("mongodb://localhost/redditdb", { useNewUrlParser: true });

// CONNECTION FOR MONGO DB !!! (format)
// Database configuration with mongoose
// var databaseUri = "mongodb://localhost/redditdb";

// if (process.env.MONGODB_URI) {
//   mongoose.connect(process.env.MONGODB_URI);
// } else {
//   mongoose.connect(databaseUri);
// }
// var db = mongoose.connection;

// db.on("error", function(error) {
//   console.log("Mongoose Error: ", error);
// });

// db.once("open", function() {
//   console.log("Mongoose connection sucessful.");
// });


// ROUTES TO SCRAPE
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://old.reddit.com/r/webdev/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      // An empty array to save the data that we'll scrape
      var results = [];
      // With cheerio, find each p-tag with the "title" class
      $("p.title").each(function(i, element) {
        // Save the text of the element in a "title" variable
        var title = $(element).text();
        // In the currently selected element, look at its child elements (i.e., its a-tags),
        // then save the values for any "href" attributes that the child elements may have
        var link = $(element).children().attr("href");
        // Save these results in an object that we'll push into the results array we defined earlier
        results.push({
          title: title,
          link: link
        });
      });
      // Log the results once you've looped through each of the elements found with cheerio
      console.log(results); //go to my node terminal server
    //   res.send(results);
    });
  //CREATE NEW ARTICLE
    // Create a new Article using the `result` object built from scraping
        db.Article.create(res)
          .then(function(redditdb) {
            // View the added result in the console
            console.log(redditdb);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
    // Send a message to the client
      res.send("Scrape Complete");
      });
   

  
  // ROUTE FOR GETTING ALL ARTICLES FROM THE DB
  app.get("/articles", function(req, res) {
    // TODO: Finish the route so it grabs all of the articles
    Article.find({})
    .then(Article => res.json(Article))
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
    Article.findOne({_id: req.params.id})
    .populate("note")
    .then( Article => res.json(Article))
  }); 
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
    Note.create(req.body)
    .then( dbNote => db.Article.findOneAndUpdate(
    {_id:req.params.id},
    {$set:{note:dbNote.id}}
    ))
    .then(redditdb => res.json(redditdb))
  });

// Listener
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });