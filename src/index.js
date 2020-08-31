const config = require("../config");
const fs = require("fs");
const path = require("path");
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
    data: config.data,
    poems: poemsData,
    paths: config.paths,
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

// Create any other pages
const pagesFolder = path.join(__dirname, config.dev.pagesDir);
console.log(pagesFolder);
fs.readdir(pagesFolder, (err, files) => {
    if (err) {
        console.log("Error getting pages folder.");
    } else {
        const pages = files.filter((file) => {
            // Remove home and poem since those have special handlings
            return file !== "home.html" && file !== "poem.html";
        });

        pages.forEach((page) => {
            const pageName = page.slice(0, -5); // remove .html
            const templatePath = path.join(__dirname, config.dev.pagesDir, page);
            const template = fs.readFileSync(templatePath, "utf8");

            // Create folder for page
            if (!fs.existsSync(`${config.dev.outDir}/${pageName}`)) {
                fs.mkdirSync(`${config.dev.outDir}/${pageName}`);
            }

            // Populate HTML
            const pageHtml = sqrl.render(template, {
                data: config.data,
                poems: poemsData,
            });

            // Place HTML in public/
            fs.writeFile(`${config.dev.outDir}/${pageName}/index.html`, pageHtml, (error) => {
                if (error) {
                    throw error;
                }
                console.log(`${pageName}/index.html was created successfully`);
            });
        });
    }
});
