const config = require("../config");
const fs = require("fs");
const path = require("path");
const sqrl = require("squirrelly");
const { logSuccess, logError } = require("./utils");

const { getPoems } = require("./poems");

// Prepare the squirrelly helpers
sqrl.filters.define("toArray", (array) => {
    return `[ ${array.map((item) => JSON.stringify(item))}]`;
});

// Prepare all of the poems
const poemsData = getPoems().map((poem) => {
    return {
        ...poem,
        // Allows differentiating line spacing between text wrap and
        // line breaks in poems
        body: poem.body
            .replace(/\n\n/g, '<div class="spacer-2"></div>')
            .replace(/\n/g, '<div class="spacer"></div>'),
    };
});

// Create the public folder
if (!fs.existsSync(config.dev.outDir)) {
    fs.mkdirSync(config.dev.outDir);
}

// Prepare the HTML components
const componentFiles = fs.readdirSync(path.join(__dirname, config.dev.componentsDir));
const components = {};
componentFiles.forEach((file) => {
    const componentName = file.slice(0, -5); // removes .html
    const componentHtml = fs.readFileSync(
        path.join(__dirname, config.dev.componentsDir, file),
        "utf8"
    );
    components[componentName] = componentHtml;
});

// Create the home page
const homeTemplate = fs.readFileSync("./src/pages/home.html", "utf8");
const homeHtml = sqrl.render(homeTemplate, {
    data: config.data,
    poems: poemsData,
    paths: config.paths,
    components,
});
fs.writeFile(`${config.dev.outDir}/index.html`, homeHtml, (error) => {
    if (error) {
        logError("index.html");
        throw error;
    }
    logSuccess("index.html");
});

// Create the pages for each poem
if (!fs.existsSync(`${config.dev.outDir}/poems/`)) {
    fs.mkdirSync(`${config.dev.outDir}/poems/`);
}
poemsData.forEach((poem, index) => {
    if (!fs.existsSync(`${config.dev.outDir}/poems/${poem.path}`)) {
        fs.mkdirSync(`${config.dev.outDir}/poems/${poem.path}`);
    }
    const poemData = {
        poem, // poem data
        config, // site data
        components,
        nextPoem: index === poemsData.length - 1 ? null : poemsData[index + 1],
        prevPoem: index === 0 ? null : poemsData[index - 1],
    };

    const poemTemplate = fs.readFileSync("./src/pages/poem.html", "utf8");
    const poemHtml = sqrl.render(poemTemplate, poemData);

    fs.writeFile(`${config.dev.outDir}/poems/${poem.path}/index.html`, poemHtml, (error) => {
        if (error) {
            logError("poems/" + poem.path + "/index.html");
            throw error;
        }
        logSuccess("poems/" + poem.path + "/index.html");
    });
});

// Create any other pages
const pagesFolder = path.join(__dirname, config.dev.pagesDir);
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
                components,
            });

            // Place HTML in public/
            fs.writeFile(`${config.dev.outDir}/${pageName}/index.html`, pageHtml, (error) => {
                if (error) {
                    logError(pageName + "/index.html");
                    throw error;
                }
                logSuccess(pageName + "/index.html");
            });
        });
    }
});
