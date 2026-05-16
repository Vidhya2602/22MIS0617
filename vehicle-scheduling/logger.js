const fs = require("fs");

function log(message) {
    const logMessage = `${new Date().toISOString()} - ${message}\n`;

    fs.appendFileSync("app.log", logMessage);
}

module.exports = log;