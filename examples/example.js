var PBSTvSchedules = require('../'),
    options = {};

options.api_key =  process.env.PBS_TV_SCHEDULES_API_KEY || null;
options.log_level = "info";

var pbsAPI = new PBSTvSchedules(options);
var zip = 94110;

// Promises example
pbsAPI.get_callsigns_by_zip(zip)
.then(function (stations){
    pbsAPI.logger.info("get_callsigns_by_zip", stations);
}, function(err){
    pbsAPI.logger.error(err);
});

// Async example
pbsAPI.get_callsigns_by_zip_async(zip, function(err, stations){
    var logger = pbsAPI.logger;
    logger.info("get_callsigns_by_zip_async", stations);
});

// Get upcomings on KQED for show_id
var show_id = 3190;
pbsAPI.get_upcoming_by_callsign_program_id('kqed', show_id)
.then(function(results){
    pbsAPI.logger.info("Title for first airing episode of show_id " + show_id, results.upcoming_episodes[0].episode_title);
})
.fail(function(err){
    pbsAPI.logger.error(err);
})
.done();

// Get a zipcode for an ip address
var ip = '8.8.8.8';
pbsAPI.get_zip_from_ip(ip)
.then(function(results){
    pbsAPI.logger.info("Zip code for ip " + ip + " is", results.$items[0].zipcode);
})
.fail(function(err){
    pbsAPI.logger.error(err);
})
.done();