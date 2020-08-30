const config = require("../config");
const fs = require("fs");
const sqrl = require("squirrelly");

const createPoem = require("./poems");

const poemsData = fs
    .readdirSync(config.dev.poemsDir)
    .map((poem) => poem.slice(0, -3))
    .map((poem) => createPoem(poem));

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
poemsData.forEach((poem) => {
    if (!fs.existsSync(`${config.dev.outDir}/${poem.path}`)) {
        fs.mkdirSync(`${config.dev.outDir}/${poem.path}`);
    }

    const poemTemplate = fs.readFileSync("./src/pages/poem.html", "utf8");
    const poemHtml = sqrl.render(poemTemplate, { poem, config });

    fs.writeFile(`${config.dev.outDir}/${poem.path}/index.html`, poemHtml, (error) => {
        if (error) {
            throw error;
        }
        console.log(`${poem.path}/index.html was created successfully`);
    });
});
