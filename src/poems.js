const config = require("../config");
const fs = require("fs");

const createPoem = (poemPath) => {
    const data = fs.readFileSync(`${config.dev.poemsDir}/${poemPath}.json`, "utf8");
    const content = JSON.parse(data);
    content.path = poemPath;
    content.date = new Date(content.date).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    return content;
};

const getPoems = () => {
    return fs
        .readdirSync(config.dev.poemsDir)
        .map((poem) => poem.slice(0, -5)) //remove .json
        .map((poem) => createPoem(poem))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
};

const getPoemsApi = () => {
    return getPoems().map((poemData, index) => {
        const { path, ...poem } = poemData;
        poem.id = index;
        return poem;
    });
};

module.exports = { getPoemsApi, getPoems };
