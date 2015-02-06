### Summary
A node module implementing the [PBS TV Schedules API](https://projects.pbs.org/confluence/display/tvsapi/TV+Schedules+Version+2)

### Install
```
$ git clone
$ cd node-pbs-tv-schedules
$ npm install -l
```

### Test
Some tests require an api_key. Some don't
```
$ export PBS_TV_SCHEDULES_API_KEY='YOUR_KEY'
$ npm test
```

### Usage
```
PBSTvSchedules = require('node-pbs-tv-schedules');
var options = {};
options.api_key = 'YOUR_API_KEY';

pbsAPI = new PBSTvSchedules(options);
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
```
