var PBSTvSchedules = require('../'),
    moment = require('moment'),
    options = {},
    callsign = 'kqed',
    zipcode = 94110;

options.api_key =  process.env.PBS_TV_SCHEDULES_API_KEY || null;
options.log_level = "info";

var pbsAPI = new PBSTvSchedules(options);

var request_options = {
    method          : 'GET',
    url             : pbsAPI.base_url + 'tvss/' + callsign + '/channels/zip/' + zipcode
};

// Promises example
pbsAPI.standard_http_request(request_options)
.then(function (response){
    pbsAPI.logger.info("Channels", response);
}, function(err){
    pbsAPI.logger.error(err);
});

// Async example
pbsAPI.standard_http_request_async(request_options, function(err, response){
    var logger = pbsAPI.logger;
    logger.info("Channels", response);
});