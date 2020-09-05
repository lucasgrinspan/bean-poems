// https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
const express = require("express");
const path = require("path");

const { getPoemsApi } = require("../poems");
const analyticsMiddleware = require("./analytics");
const { connectToDB } = require("./db/db");

// start db
connectToDB();

const app = express();

// get the poems data
const poemsData = getPoemsApi();

app.use(analyticsMiddleware);

app.use(express.static("public"));

// API endpoints
// list all poems
app.get("/api/poems", (req, res) => {
    res.send(poemsData);
});
// get a random poem
app.get("/api/poems/random", (req, res) => {
    const randomPoem = poemsData[Math.floor(Math.random() * poemsData.length)];
    res.send(randomPoem);
});
// get a specific poem
app.get("/api/poems/:id", (req, res) => {
    const poemID = +req.params.id;

    if (!Number.isInteger(poemID)) {
        res.status(400).send({ error: "Given ID is not a number" });
    }
    if (poemID < 0 || poemID >= poemsData.length) {
        res.status(400).send({ error: "Poem does not exist" });
    }
    res.send(poemsData[poemID]);
});
// 404 on api
app.get("/api/*", (req, res) => {
    res.status(404).send({ error: "API path does not exist" });
});

// general 404
app.get("*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "../../public/404/index.html"));
});

app.listen(5000, () => console.log("Server started"));
