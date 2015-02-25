var request             = require('request'),
    util                = require('util'),
    P                   = require('p-promise'),
    nodeify             = require('nodeify'),
    default_logger      = require('./logger');

function PBSTvSchedules (options) {
    if (!options) {
        options = {};
    }
    if (options.logger) {
        this.logger = options.logger;
    } else {
        this.logger = default_logger;
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

// Standard http get using options
PBSTvSchedules.prototype.standard_http_get = function (options) {
    var deferred = P.defer(),
        logger = this.logger;

    request(options, function(err, res, obj){
        if (err) {
            logger.error(err);
            deferred.reject(err);
        }
        try {
            data = JSON.parse(obj);
        } catch (e) {
            logger.error(e);
            deferred.reject(e);
        }
        deferred.resolve(data);
    });

    return deferred.promise;
};


// Get list of upcoming programs for provided callsign
// Requires API KEY
PBSTvSchedules.prototype.get_upcoming_by_callsign_program_id = function (program_id, callsign) {
    var logger = this.logger,
        options = {},
        deferred = P.defer();

    callsign = callsign.toLowerCase();
    options.headers = this.base_headers;
    options.method = 'GET';
    options.url = this.base_url + 'tvss/' + callsign + '/upcoming/program/' + program_id + '/';

    // logger.debug("callsign", callsign, "program_id", program_id);
    request(options, function(err, res, obj){
        if (err) {
            logger.error(err);
            deferred.reject(err);
        }
        var obj_parsed;
        if (!res || res.statusCode !== 200) {
            var msg = "no response";
            if (res) {
                msg = res.statusCode;
            }
            return deferred.reject(msg);
        }

        try {
            obj_parsed = JSON.parse(obj);
        } catch (e) {
            logger.error('statusCode', res.statusCode);
            // logger.debug("obj", util.inspect(obj));
            logger.error("get_upcoming_by_callsign_program_id parse", e);
            return deferred.reject(e);
        }

        if (obj_parsed) {
            obj_parsed.callsign = callsign;
        }
        // logger.debug('get_upcoming_by_callsign_program_id:obj_parsed', obj_parsed);
        deferred.resolve(obj_parsed);
    });
    return deferred.promise;
};
// Non-Promises
PBSTvSchedules.prototype.get_upcoming_by_callsign_program_id_async = function (program_id, callsign, callback){
    return nodeify(this.get_upcoming_by_callsign_program_id(program_id, callsign), callback);
};

// Get callsigns by zip. This accesses .json files. No API Key auth needed
PBSTvSchedules.prototype.get_callsigns_by_zip = function (zip) {
    var url = this.base_url + 'callsigns/zip/' + zip + '.json',
        deferred = P.defer(),
        logger = this.logger;

    options = {};
    options.url = url;
    options.method = 'GET';
    request(options, function(err, res, obj){
        if (err) {
            logger.error(err);
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
            logger.error(e);
            deferred.reject(e);
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
PBSTvSchedules.prototype.get_callsigns_by_zip_async = function (zip, callback){
    return nodeify(this.get_callsigns_by_zip(zip), callback);
};

PBSTvSchedules.prototype.get_programs = function () {
    var url = this.base_url +  'tvss/' + 'programs',
        logger = this.logger,
        options = {
            url         : url,
            method      : 'GET'
        };
    return this.standard_http_get(options);
};
PBSTvSchedules.prototype.get_programs_async = function (callback){
    return nodeify(this.get_programs(), callback);
};


PBSTvSchedules.prototype.get_zip_from_ip = function (ip_address) {
    var url = this.base_url +  'zipcodes/ip/' + ip_address + '.json',
        options = {
            url         : url,
            method      : 'GET'
        };
    return this.standard_http_get(options);
};
PBSTvSchedules.prototype.get_zip_from_ip_async = function (ip_address, callback){
    return nodeify(this.get_zip_from_ip(ip_address), callback);
};





module.exports = PBSTvSchedules;