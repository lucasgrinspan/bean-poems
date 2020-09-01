const config = require("../config");
const fs = require("fs");

const createPoem = (poemPath) => {
    const data = fs.readFileSync(`${config.dev.poemsDir}/${poemPath}.json`, "utf8");
    const content = JSON.parse(data);
    content.path = poemPath;
    return content;
};

const getPoems = () => {
    return fs
        .readdirSync(config.dev.poemsDir)
        .map((poem) => poem.slice(0, -5)) //remove .json
        .map((poem) => createPoem(poem))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
};

const getPoemsApi = () => {};

module.exports = { createPoem, getPoems };
