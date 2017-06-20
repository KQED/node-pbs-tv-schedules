var PBSTvSchedules = require('../'),
    moment = require('moment'),
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

// Get upcomings on KQED for program_id
var program_id = 3190;
pbsAPI.get_upcoming_by_callsign_program_id('kqed', program_id)
.then(function(results){
    pbsAPI.logger.info("Title for first airing episode of program_id " + program_id, results.upcoming_episodes[0].episode_title);
})
.catch(function(err){
    pbsAPI.logger.error(err);
})
.done();

// Get upcomings on KQED for show_id
var show_id = episode_44926;
pbsAPI.get_upcoming_by_callsign_show_id('kqed', show_id)
.then(function(results){
    pbsAPI.logger.info("Title for episode of show_id " + show_id, results.episode_title);
})
.catch(function(err){
    pbsAPI.logger.error(err);
})
.done();

// Get a zipcode for an ip address
var ip = '8.8.8.8';
pbsAPI.get_zip_from_ip(ip)
.then(function(results){
    pbsAPI.logger.info("Zip code for ip " + ip + " is", results.$items[0].zipcode);
})
.catch(function(err){
    pbsAPI.logger.error(err);
})
.done();

// Get day's listing for KQED
var datestamp = moment().format('YYYYMMDD'),
    callsign = 'kqed';
pbsAPI.get_day_schedule_for_callsign_date(callsign,datestamp)
.then(function(results){
    pbsAPI.logger.info("Found " + results.feeds.length + " items");
})
.catch(function (err) {
    pbsAPI.logger.error(err);
})
.done();