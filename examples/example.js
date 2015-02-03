var PBSTvSchedules = require('../'),
    options = {};

options.api_key =  process.env.PBS_API_KEY || null;

var pbsAPI = new PBSTvSchedules(options);
var zip = 94110;

// Promises example
pbsAPI.get_stations_by_zip(zip)
.then(function (stations){
    pbsAPI.logger.info("get_stations_by_zip", stations);
}, function(err){
    console.error(err);
});

// Async example
pbsAPI.get_stations_by_zip_async(zip, function(err, stations){
    var logger = pbsAPI.logger;
    logger.info("get_stations_by_zip", stations);
});