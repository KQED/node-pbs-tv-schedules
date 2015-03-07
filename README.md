## Summary
A node module implementing the [PBS TV Schedules API](https://projects.pbs.org/confluence/display/tvsapi/TV+Schedules+Version+2) to provide National PBS TV Schedules.

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

pbsAPI.get_callsigns_by_zip(zip)
.then(function (stations){
    pbsAPI.logger.info("get_callsigns_by_zip", stations);
}, function(err){
    pbsAPI.logger.error(err);
});
```
