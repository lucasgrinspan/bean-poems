const express = require("express");
const path = require("path");
const { getPoems } = require("./poems");

const app = express();

// get the poems data
const poemsData = getPoems();

app.use(express.static("public"));

// API endpoints
app.get("/api/poems", (req, res) => {
    res.send(JSON.stringify(poemsData));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/404/index.html"));
});

app.listen(5000, () => console.log("Server started"));
