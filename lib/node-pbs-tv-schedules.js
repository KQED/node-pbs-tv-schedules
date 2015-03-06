var request             = require('request'),
    P                   = require('p-promise'),
    nodeify             = require('nodeify'),
    default_logger      = require('./logger');

function PBSTvSchedules (options) {
    if (!options) {
        options = {};
    }
    // Accept buntan logger or use default
    if (options.logger) {
        this.logger = options.logger;
    } else {
        this.logger = default_logger;
    }
    if (options.log_level) {
        this.logger.level = options.log_level;
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

// Standard http request with options
PBSTvSchedules.prototype.standard_http_request = function (options) {
    var deferred = P.defer(),
        logger = this.logger;

    request(options, function(err, res, obj){
        if (err) {
            logger.error('PBSTvSchedules.standard_http_request.request', err);
            return deferred.reject(err);
        }
        if (!res || res.statusCode !== 200) {
            var msg = "no response";
            if (res) {
                msg = res.statusCode;
            }
            return deferred.reject(msg);
        }

        try {
            data = JSON.parse(obj);
        } catch (e) {
            logger.error('PBSTvSchedules.standard_http_request', e);
            return deferred.reject(e);
        }
        deferred.resolve(data);
    });
    return deferred.promise;
};

// Get list of upcoming programs for provided program_id, callsign  Ex: (3190, 'kqed')
// API Key required
PBSTvSchedules.prototype.get_upcoming_by_callsign_program_id = function (callsign, program_id) {
    var self = this,
        logger = this.logger,
        options = {},
        deferred = P.defer();

    callsign = callsign.toLowerCase();
    options.headers = this.base_headers;
    options.method = 'GET';
    options.url = this.base_url + 'tvss/' + callsign + '/upcoming/program/' + program_id + '/';

    self.standard_http_request(options)
    .then(function(results){
        if (results) {
            results.callsign = callsign;
            deferred.resolve(results);
        } else {
            deferred.reject(null);
        }
    })
    .fail(function(e){
        deferred.reject(e);
    });
    return deferred.promise;
};
// Non-Promises
PBSTvSchedules.prototype.get_upcoming_by_callsign_program_id_async = function (callsign, program_id, callback){
    return nodeify(this.get_upcoming_by_callsign_program_id(callsign, program_id), callback);
};

// Get callsigns by zip. This accesses .json files.
// No API Key required
// Params
//    zip (94110)
// Output
//      [ 'KQED', 'KQEH', 'KRCB' ]
PBSTvSchedules.prototype.get_callsigns_by_zip = function (zip) {
    var self = this,
        url = this.base_url + 'callsigns/zip/' + zip + '.json',
        deferred = P.defer(),
        logger = this.logger,
        callsigns = [];

    options = {};
    options.url = url;
    options.method = 'GET';

    self.standard_http_request(options)
    .then(function(data){
        data.$items.forEach(function(station){
            if (station && station.$links) {
                station.$links.forEach(function(link){
                    if (link.callsign) {
                        callsigns.push(link.callsign);
                    }
                });
            }
        });
        deferred.resolve(callsigns);
    })
    .fail(function(e){
        deferred.reject(e);
    });
    return deferred.promise;
};
// Non-Promises
PBSTvSchedules.prototype.get_callsigns_by_zip_async = function (zip, callback){
    return nodeify(this.get_callsigns_by_zip(zip), callback);
};

// Gets a list of all programs available on PBS. Slow request!
PBSTvSchedules.prototype.get_programs = function () {
    var url = this.base_url +  'tvss/' + 'programs',
        logger = this.logger,
        options = {
            url         : url,
            method      : 'GET'
        };
    return this.standard_http_request(options);
};
PBSTvSchedules.prototype.get_programs_async = function (callback){
    return nodeify(this.get_programs(), callback);
};

// Use PBS's Localization service (Not l10n) to get the zip code
// for a given ip_address
// No API Key required
// Ex: http://services.pbs.org/zipcodes/ip/8.8.8.8.json
// Output is json
PBSTvSchedules.prototype.get_zip_from_ip = function (ip_address) {
    var url = this.base_url +  'zipcodes/ip/' + ip_address + '.json',
        options = {
            url         : url,
            method      : 'GET'
        };

    return this.standard_http_request(options);
};
PBSTvSchedules.prototype.get_zip_from_ip_async = function (ip_address, callback){
    return nodeify(this.get_zip_from_ip(ip_address), callback);
};

module.exports = PBSTvSchedules;