// A basic logger to use as default
var bunyan = require("bunyan"),
    options = {},
    logger;

options.name = "PBSTvSchedules";
options.level = "info"; // Should be "info"
logger = bunyan.createLogger(options);

module.exports = logger;