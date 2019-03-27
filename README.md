# NYT Scraper

I've created a web app that lets users view the latest New York Times news via scraping. You may also add notes to articles, viewable at the bottom of the webpage.

This is built using Node, Express, Mongo, Mongoose, Cheerio, Axios, and a MVC Paradigm; for assignment 13 of UMN's Coding Bootcamp. 

![](public/img/homePage.png)

### How to use on Heroku
1. Go to https://nyt--scraper.herokuapp.com/.
2. Click the `Search New Articles` button and your screen will populate after you recieve an alert of the scrape. 
3. View the articles by clicking on the title. 
4. Add a note by clicking the `note` button below the article and inputing this on the buttom of the webpage. 
5. Reference your notes at the bottom of the webpage. Clicking the note button again will show additional notes at the bottom of the page.

### How to use locally

1. Direct or `cd` yourself in terminal to a root folder where you'd like to test our project. 
2. Go to https://github.com/HannahSchuelke/redditScraper and clone the repository, or type `git clone https://github.com/HannahSchuelke/NYTScraper.git` into that same root folder.  
3. Type `npm install` also into your terminal from the same folder. 
4. Type `node server.js` into your terminal to start the server.
5. Download Mongo at https://www.mongodb.com/download-center.
6. Open up terminal and enter the `mongod` command
7. Open up terminal and enter the `mongo` command
8. Type "http://localhost:3000/" into the URL and you will be able to see my html.
9.  In "http://localhost:3000/" you may press the button, and it will populate your command line with results.
10. Go to "http://localhost:3000/scrape" into the URL and you will be able to see the scraping results in your webpage and terminal.
11. 10. Go to "http://localhost:3000/articles" into the URL and you will be able to see the scraping results in your webpage and terminal.


## Repository on Github

https://github.com/HannahSchuelke/NYTScraper

## Deployment on Github

https://hannahschuelke.github.io/NYTScraper/

## Deployment on Heroku

https://nyt--scraper.herokuapp.com/

## Built With

* [npm install](https://docs.npmjs.com/cli/install) - Installs package.json and node.modules that app depends on
* [MongoDB](https://www.mongodb.com/download-center) - Needed for database


## Author

* **Hannah Schuelke** - [HannahSchuelke](https://github.com/HannahSchuelke)