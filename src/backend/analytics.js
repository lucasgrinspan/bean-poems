const crypto = require("crypto");
const { addToPageview } = require("./db/db");

let pageviews = new Map();
let siteVisits = new Set();

let randomString = Math.random().toString(36).slice(2);

const dailyRefreshRate = 1000 * 60 * 60 * 24; // every day

const saveToDB = (pageviewsMap, siteVisitsSet) => {
    pageviewsMap.forEach((views, pagePath) => {
        addToPageview(pagePath, views.size);
    });
    addToPageview("BEANPOEMS.COM", siteVisitsSet.size);
};

setInterval(() => {
    console.log("Refreshing Analytics");
    // Runs once per day:
    //  Changes the random string
    //  Saves to the DB
    //  Clears the accumulated data in memory
    randomString = Math.random().toString(36).slice(2);

    saveToDB(pageviews, siteVisits);

    pageviews = new Map();
    siteVisits = new Set();

    console.log("Analytics Refreshed");
}, dailyRefreshRate);

const generateUniqueId = (req, pageSpecific) => {
    const ip = req.ip;
    const ua = req.get("user-agent");
    const date = new Date().getDate().toString();
    let uniqueID = randomString + ip + ua + date;
    if (pageSpecific) {
        // add the page to the hash
        const page = req.originalUrl;
        uniqueID += page;
    }
    return crypto.createHash("sha256").update(uniqueID).digest("base64");
};

const logPageView = (pagePath, hash) => {
    if (pageviews.has(pagePath)) {
        pageviews.get(pagePath).add(hash);
    } else {
        pageviews.set(pagePath, new Set([hash]));
    }
};

const logSiteVisit = (hash) => {
    siteVisits.add(hash);
};

// TODO: experiment with Navigator.setBeacon to track bounce rate and session time
const analyticsMiddleware = (req, res, next) => {
    const url = req.originalUrl;
    // rudimentary way to check for a page view
    if (url.slice(-1) === "/") {
        // Now that we have a pageview, generate a unique id
        const pageHash = generateUniqueId(req, true);
        const siteHash = generateUniqueId(req, false);

        // track the visit
        logPageView(url, pageHash);
        logSiteVisit(siteHash);
    }

    next();
};

module.exports = analyticsMiddleware;
