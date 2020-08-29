const config = require("../../config");

module.exports = (poems) => `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${config.data.description}" />
        <title>${config.data.name}</title>
    </head>
    <body>
        <div class="grotesk">
            <header>
                <h1>${config.data.name}</h1>
                <p>Little bean sized poems about life and everything in between. Written by ${
                    config.data.author
                }</p>
                <hr />
            </header>
            <div class="poems">
                ${poems
                    .map(
                        (poem) => `
                        <div class="post">
                            <h3><a href="./${poem.path}">${poem.attributes.title}</a></h3>
                            <p>${poem.attributes.description}</p>
                        </div>`
                    )
                    .join("")}
            </div>
            <footer>
                <p>Built with <span role="img" aria-label="love">&#10084;&#65039;</span> by ${
                    config.data.author
                }</p>
            </footer>
        </div>
    </body>
</html>
`;
