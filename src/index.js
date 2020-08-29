const config = require("../config");
const fs = require("fs");

const poems = require("./poems");
const home = require("./pages/home");

const poemsData = fs
    .readdirSync(config.dev.poemsDir)
    .map((poem) => poem.slice(0, -3))
    .map((poem) => poems.createPoem(poem));

if (!fs.existsSync(config.dev.outDir)) {
    fs.mkdirSync(config.dev.outDir);
}

// Create the home page
fs.writeFile(`${config.dev.outDir}/index.html`, home(poemsData), (error) => {
    if (error) {
        throw error;
    }
    console.log(`index.html was created successfully`);
});

// Create the pages for each poem
poemsData.forEach((poem) => {
    if (!fs.existsSync(`${config.dev.outDir}/${poem.path}`)) {
        fs.mkdirSync(`${config.dev.outDir}/${poem.path}`);
    }

    fs.writeFile(
        `${config.dev.outDir}/${poem.path}/index.html`,
        poems.createPoemHtml(poem),
        (error) => {
            if (error) {
                throw error;
            }
            console.log(`${poem.path}/index.html was created successfully`);
        }
    );
});
