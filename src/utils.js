const logSuccess = (page) => console.log(`✅ ${page} created successfully`);

const logError = (page) => console.log(`❌ ${page} failed to create`);

module.exports = {
    logSuccess,
    logError,
};
