const config = require("../config");
const fs = require("fs");
const sqrl = require("squirrelly");

const createPoem = require("./poems");

// Prepare all of the poems
const poemsData = fs
    .readdirSync(config.dev.poemsDir)
    .map((poem) => poem.slice(0, -3))
    .map((poem) => createPoem(poem))
    .sort((a, b) => new Date(b.attributes.date) - new Date(a.attributes.date));

// Create the public folder
if (!fs.existsSync(config.dev.outDir)) {
    fs.mkdirSync(config.dev.outDir);
}

// Create the home page
const homeTemplate = fs.readFileSync("./src/pages/home.html", "utf8");
const homeHtml = sqrl.render(homeTemplate, {
    ...config.data,
    poems: poemsData.slice(0, 3), // 3 most recent poems
});

fs.writeFile(`${config.dev.outDir}/index.html`, homeHtml, (error) => {
    if (error) {
        throw error;
    }
    console.log(`index.html was created successfully`);
});

// Create the pages for each poem
poemsData.forEach((poem, index) => {
    if (!fs.existsSync(`${config.dev.outDir}/${poem.path}`)) {
        fs.mkdirSync(`${config.dev.outDir}/${poem.path}`);
    }
    const poemData = {
        poem, // poem data
        config, // site data
        nextPoem: index === poemsData.length - 1 ? null : poemsData[index + 1],
        prevPoem: index === 0 ? null : poemsData[index - 1],
    };

    const poemTemplate = fs.readFileSync("./src/pages/poem.html", "utf8");
    const poemHtml = sqrl.render(poemTemplate, poemData);

    fs.writeFile(`${config.dev.outDir}/${poem.path}/index.html`, poemHtml, (error) => {
        if (error) {
            throw error;
        }
        console.log(`${poem.path}/index.html was created successfully`);
    });
});
