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

const createPoemHtml = (data) => `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${data.attributes.description}" />
        <title>Bean Poems | ${data.attributes.title}</title>
        <link rel=”stylesheet” href=”./assets/main.css” />
    </head>
    <body>
        <header>
            <a href="/">Go back home</a>
        </header>
        <div class="content">
            <h1>${data.attributes.title}</h1>
            <hr />
            ${data.body}
        </div>
    </body>
</html>
`;

module.exports = {
    createPoem,
    createPoemHtml,
};
