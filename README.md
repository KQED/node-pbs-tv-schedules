## Summary
A node module implementing the [PBS TV Schedules API](https://projects.pbs.org/confluence/display/tvsapi/TV+Schedules+Version+2) to provide National PBS TV Schedule information and ip to zip locator services.

See
* https://projects.pbs.org/confluence/display/tvsapi/TV+Schedules+Version+2
* https://projects.pbs.org/confluence/display/localization/Locator

[![Build Status](https://travis-ci.org/KQED/node-pbs-tv-schedules.svg?branch=release)](https://travis-ci.org/KQED/node-pbs-tv-schedules)

## Prerequisites
* [node.js](https://nodejs.org/)
* A PBS TV Schedules API Key. Request one [here](http://open.pbs.org/tools/pbs-api-key-request/).

## Install
```
$ npm install node-pbs-tv-schedules
```
Or
```
$ git clone git@github.com:KQED/node-pbs-tv-schedules.git
$ cd node-pbs-tv-schedules
$ npm install
```

## Usage
See `examples`

### Custom Request
See `examples/custom_request.js` for example of how to craft the PBS TV Schedule Method url.
```
$ export PBS_TV_SCHEDULES_API_KEY='YOUR_KEY'
$ cd examples
$ node custom_request.js
[2015-07-09T22:53:00.071Z]  INFO: node-pbs-tv-schedules/79425 on kip-mbp.kqed.org:
    Channels { headends:
       [ { feeds: [Object], name: 'AT&T U-verse - San Francisco' },
         { feeds: [Object], name: 'Astound Broadband - San Francisco' },
         { feeds: [Object], name: 'Broadcast TV - Oakland' },
         { feeds: [Object], name: 'Broadcast TV - San Fran-Oak-Sj' },
         { feeds: [Object], name: 'Comcast - San Francisco' },
         { feeds: [Object], name: 'DirecTV - San Francisco-Oak-SJ' },
         { feeds: [Object], name: 'Dish Network - San Francisco-Oak-SJ' },
         { feeds: [Object],
           name: 'TVMAX - Bernal Heights - San Francisco' } ] }
...
```
### Built In Functions
There are some built in functions for common actions.
See `examples/examples.js`
```
$ export PBS_TV_SCHEDULES_API_KEY='YOUR_KEY'
$ cd node-pbs-tv-schedules
$ npm run example
00:31:43.470Z  INFO node-pbs-tv-schedules: Title for first airing episode of show_id 3190 This Perfect World
00:31:43.510Z  INFO node-pbs-tv-schedules: Zip code for ip 8.8.8.8 is 94040
00:31:43.517Z  INFO node-pbs-tv-schedules: get_callsigns_by_zip [ 'KQED', 'KQEH', 'KRCB' ]
00:31:43.576Z  INFO node-pbs-tv-schedules: get_callsigns_by_zip_async [ 'KQED', 'KQEH', 'KRCB' ]
```
### Example Code
```js
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

// Get upcomings on KQED for show_id
var show_id = 3190;
pbsAPI.get_upcoming_by_callsign_program_id('kqed', show_id)
.then(function(results){
    pbsAPI.logger.info("Title for first airing episode of show_id " + show_id, results.upcoming_episodes[0].episode_title);
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
    pbsAPI.logger.info("Found " + results.feeds.length + " channels");
})
.catch(function (err) {
    pbsAPI.logger.error(err);
})
.done();
```

## Tests
Some tests require an api_key.
```
$ export PBS_TV_SCHEDULES_API_KEY='YOUR_KEY'
$ cd node-pbs-tv-schedules
$ npm test
```