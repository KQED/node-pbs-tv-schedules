var request             = require('request'),
    util                = require('util'),
    P                   = require('p-promise'),
    nodeify              = require('nodeify');

function PBSTvSchedules (options) {
    if (!options) {
        options = {};
    }
    if (options.logger) {
        this.logger = options.logger;
    } else {
        this.logger = require('./logger');
    }
    this.base_url = options.base_url || 'https://services.pbs.org/';
    this.api_key = options.api_key || null;
    this.set_api_key(this.api_key);
}

PBSTvSchedules.prototype.set_api_key = function (api_key){
    this.api_key = api_key;
    this.base_headers =  {
        'X-PBSAUTH': this.api_key
    };
};

// Get list of upcoming programs for provided callsign
// Requires API KEY
PBSTvSchedules.prototype.get_upcoming_programs_by_callsign = function (program_id, callsign) {
    var logger = this.logger,
        options = {},
        deferred = P.defer();

    callsign = callsign.toLowerCase();
    options.headers = this.base_headers;
    options.method = 'GET';
    options.url = this.base_url + 'tvss/' + callsign + '/upcoming/program/' + program_id + '/';

    logger.debug("options", options);
    request(options, function(err, res, obj){
        if (err) {
            deferred.reject(err);
        }
        var retVal = [],
            obj_parsed;

        try {
            obj_parsed = JSON.parse(obj);
        } catch (e) {
            logger.error("get_upcoming_programs_by_callsign parse", e);
            return deferred.reject(e);
        }

        if (obj_parsed && obj_parsed.upcoming_episodes && obj_parsed.upcoming_episodes.length > 0) {
            retVal = obj_parsed.upcoming_episodes;
        }
        deferred.resolve(retVal);
    });
    return deferred.promise;
};
// Non-Promises
PBSTvSchedules.prototype.get_upcoming_programs_by_callsign_async = function (program_id, callsign, callback){
    return nodeify(this.get_upcoming_programs_by_callsign(program_id, callsign), callback);
};

// Get stations by zip. This accesses .json files. No API Key auth needed
PBSTvSchedules.prototype.get_stations_by_zip = function (zip) {
    var url = this.base_url + 'callsigns/zip/' + zip + '.json',
        deferred = P.defer(),
        logger = this.logger;

    options = {};
    options.url = url;
    options.method = 'GET';
    request(options, function(err, res, obj){
        if (err) {
            deferred.reject(err);
        }
        var callsigns = [],
            data;

        if (res && res.statusCode === 404) {
            deferred.resolve(callsigns);
        }

        try {
            data = JSON.parse(obj);
        } catch (e) {
            deferred.reject(err);
        }

        data.$items.forEach(function(station){
            if (station && station.$links) {
                station.$links.forEach(function(link){
                    if (link.callsign) {
                        // logger.debug("callsign", link.callsign);
                        callsigns.push(link.callsign);
                    }
                });
            }
        });
        deferred.resolve(callsigns);
    });
    return deferred.promise;
};

// Non-Promises
PBSTvSchedules.prototype.get_stations_by_zip_async = function (zip, callback){
    return nodeify(this.get_stations_by_zip(zip), callback);
};


module.exports = PBSTvSchedules;