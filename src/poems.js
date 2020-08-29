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

module.exports = createPoem;
