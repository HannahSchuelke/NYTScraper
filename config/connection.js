module.exports = {
database = process.env.MONGODB_URI || "mongodb://localhost/newsdb"
};
mongoose.connect(MONGODB_URI); 