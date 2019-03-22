module.exports = {
database = process.env.MONGODB_URI || "mongodb://localhost/redditdb"
};
mongoose.connect(MONGODB_URI); 