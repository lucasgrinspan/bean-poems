const mongoose = require("mongoose");

const url = "mongodb://127.0.0.1:27017/analytics";

let db;

// TODO: make path ID
const pageviewSchema = new mongoose.Schema({
    path: String,
    views: { type: Number, default: 0 },
});
const Pageview = mongoose.model("Pageviews", pageviewSchema);

const connectToDB = () => {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });

    db = mongoose.connection;

    db.once("open", (_) => {
        console.log("Database connected:", url);
    });

    db.on("error", (err) => {
        console.error("connection error:", err);
    });
};

const addToPageview = (pagePath, views) => {
    Pageview.findOneAndUpdate(
        { path: pagePath },
        { $inc: { views: views }, $set: { path: pagePath } },
        { upsert: true, runValidators: true },
        (err, _doc) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`successfully added ${views} views to ${pagePath}`);
            }
        }
    );
};

module.exports = {
    connectToDB,
    addToPageview,
};
