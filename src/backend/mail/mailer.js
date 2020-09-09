const nodeMailer = require("nodemailer");
const crypto = require("crypto");
const querystring = require("querystring");
const fs = require("fs");
const path = require("path");
const sqrl = require("squirrelly");

const { emailKey, emailPassword, iv } = require("../../../secrets");

let transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
        user: "beanpoems.contact@gmail.com",
        pass: emailPassword,
    },
});

// We don't want people unsubscribing other emails, so the unsubscribe link we
// send out has to be unique to the email and impossible to generate for other emails
// A hash gets generated with an email and a secret key and gets sent to the unsubscribe page
// The server then checks if the email matches the key and then performs the unsubscribe
// if the key is valid
encryptData = (data) => {
    var cipher = crypto.createCipheriv("aes-256-cbc", emailKey, iv);
    var crypted = cipher.update(data, "utf-8", "hex");
    crypted += cipher.final("hex");
    return crypted;
};
decryptData = (data) => {
    var decipher = crypto.createDecipheriv("aes-256-cbc", emailKey, iv);
    var decrypted = decipher.update(data, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
};

generateUnsubscribeLink = (email) => {
    const key = encryptData(email);
    const qs = querystring.stringify({
        key,
    });
    return `https://www.beanpoems.com/unsub?${qs}`;
};

sendEmail = (email, type) => {
    // Every email needs an unsub link
    const unsubLink = generateUnsubscribeLink(email);

    let template;
    let subject;

    switch (type) {
        case "subscribe":
            template = fs.readFileSync(path.join(__dirname, "./subscribe.html"), "utf8");
            subject = "Thanks for subscribing!";
            break;
    }

    const message = sqrl.render(template, {
        unsubLink,
    });

    let mailOptions = {
        // should be replaced with real recipient's account
        to: email,
        subject,
        html: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message %s sent: %s", info.messageId, info.response);
    });
};

module.exports = { sendEmail, decryptData };
