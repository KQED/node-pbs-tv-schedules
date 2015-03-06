## Summary
A node module implementing the [PBS TV Schedules API](https://projects.pbs.org/confluence/display/tvsapi/TV+Schedules+Version+2) to provide National PBS TV Schedules.

## Prerequisites
* [node.js](https://nodejs.org/)
* A PBS TV Schedules API Key. Request one [here](http://open.pbs.org/tools/pbs-api-key-request/).

## Install
```
$ git clone git@github.com:KQED/node-pbs-tv-schedules.git
$ cd node-pbs-tv-schedules
$ npm install
```

## Tests
Some tests require an api_key.
```
$ export PBS_TV_SCHEDULES_API_KEY='YOUR_KEY'
$ cd node-pbs-tv-schedules
$ npm test
```

## Usage
See `examples/example.js`
```
$ export PBS_TV_SCHEDULES_API_KEY='YOUR_KEY'
$ cd node-pbs-tv-schedules
$ npm run example
23:25:18.498Z  INFO node-pbs-tv-schedules: This Perfect World
23:25:18.565Z  INFO node-pbs-tv-schedules: get_callsigns_by_zip_async [ 'KQED', 'KQEH', 'KRCB' ]
23:25:18.574Z  INFO node-pbs-tv-schedules: get_callsigns_by_zip [ 'KQED', 'KQEH', 'KRCB' ]
```
### Example Code
```js
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
    pbsAPI.logger.info("Zip code for ip " + ip, results.$items[0].zipcode);
})
.fail(function(err){
    pbsAPI.logger.error(err);
})
.done();
```
