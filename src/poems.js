const config = require("../config");
const fm = require("front-matter");
const marked = require("marked");
const fs = require("fs");

const createPoem = (poemPath) => {
    const data = fs.readFileSync(`${config.dev.poemsDir}/${poemPath}.md`, "utf8");
    const content = fm(data);
    content.body = marked(content.body);
    content.path = poemPath;
    return content;
};

const getPoems = () => {
    return fs
        .readdirSync(config.dev.poemsDir)
        .map((poem) => poem.slice(0, -3))
        .map((poem) => createPoem(poem))
        .sort((a, b) => new Date(b.attributes.date) - new Date(a.attributes.date));
};

const getPoemsApi = () => {};

module.exports = { createPoem, getPoems };
