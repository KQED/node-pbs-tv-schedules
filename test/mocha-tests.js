var demand  = require('must'),
    assert  = require('assert'),
    moment  = require('moment'),
    PBSTvSchedules = require('./../');

var testzip_good = 94110,
    testzip_bad = 11111;

var PBSApi = new PBSTvSchedules();
var api_key = process.env.PBS_TV_SCHEDULES_API_KEY || null;
PBSApi.set_api_key(api_key);
console.log("PBSApi.set_api_key(api_key);", api_key);
describe("PBSTvSchedules API", function(){
    this.timeout(10000); // The PBS API is slow.

    it("must be creatable", function(){
        PBSApi.must.be.an.instanceof(PBSTvSchedules);
    });

    it("should get a list of callsigns for zip " + testzip_good + "  (async)", function(finished){
        var min_confidence = 0;
        PBSApi.get_callsigns_by_zip_async(testzip_good, min_confidence, function(err, results){
            results.must.be.an.array();
            results.length.must.equal(3);
            finished();
        });
    });

    it("should get a list of callsigns for zip " + testzip_good + " (promises)", function(finished){
        var min_confidence = 0;
        PBSApi.get_callsigns_by_zip(testzip_good, min_confidence)
        .then(function(results){
            results.must.be.an.array();
            results.length.must.equal(3);
            finished();
        })
        .done();
    });

    it("should get no list of callsigns for zip " + testzip_good + " when min_confidence is 101 (async)", function(finished){
        var min_confidence = 101;
        PBSApi.get_callsigns_by_zip_async(testzip_good, min_confidence, function(err, results){
            results.must.be.an.array();
            results.length.must.equal(0);
            finished();
        });
    });

    it("should get no list of callsigns for zip " + testzip_good + " when min_confidence is 101 (promises)", function(finished){
        var min_confidence = 101;
        PBSApi.get_callsigns_by_zip(testzip_good, min_confidence)
        .then(function(results){
            results.must.be.an.array();
            results.length.must.equal(0);
            finished();
        })
        .done();
    });



    var test_ip = '8.8.8.8',
        test_zip = '94040';
    it("should get a zip code for ip address " + test_ip + " (promises)", function(finished){
        PBSApi.get_zip_from_ip(test_ip)
        .then(function(results){
            results.must.be.an.object();
            results.must.have.keys([ '$type', '$items', '$elements', '$self' ]);
            results.$items.must.be.an.array();
            results.$items[0].zipcode.must.be(test_zip);
            finished();
        })
        .done();
    });

    it("should get a zip code for ip address " + test_ip + " (async)", function(finished){
        PBSApi.get_zip_from_ip_async(test_ip, function(err, results){
            results.must.be.an.object();
            results.must.have.keys([ '$type', '$items', '$elements', '$self' ]);
            results.$items.must.be.an.array();
            results.$items[0].zipcode.must.be(test_zip);
            finished();
        });
    });

    var fail_test_ip = '127.0.0.1';
    it ("should fail to get a zip code for ip address " + fail_test_ip + " (async)", function(finished){
        PBSApi.get_zip_from_ip_async(fail_test_ip, function(err, results){
            err.must.be(404);
            demand(results).be.undefined();
            finished();
        });
    });

    it ("should fail to get a zip code for ip address " + fail_test_ip + " (promises)", function(finished){
        PBSApi.get_zip_from_ip(fail_test_ip)
        .then(function(results){
            demand(results).be.undefined();
        })
        .catch(function(err){
            err.must.be(404);
            finished();
        })
        .done();
    });

    // *** These tests fail without PBS_TV_SCHEDULES_API_KEY environment variable being set
    if (PBSApi.api_key) {
        it("should get a list of shows for a callsign (async)", function(finished){
            var program_id = 3190;
            var callsign = "KQED",
                lc_callsign = callsign.toLowerCase();

            PBSApi.get_upcoming_by_callsign_program_id_async(callsign, program_id, function(err, results){
                demand(err).be.null("ERROR: " + err);
                results.must.be.an.object();
                results.upcoming_episodes.must.be.an.array();
                finished();
            });
        });

        it("should get a list of shows for a callsign (promises)", function(finished){
            var program_id = 3190;
            var callsign = "KQED",
                lc_callsign = callsign.toLowerCase();
            PBSApi.get_upcoming_by_callsign_program_id(callsign, program_id)
            .then(function(results){
                results.must.be.an.object();
                results.upcoming_episodes.must.be.an.array();
                finished();
            })
            .done();
        });

        it("should get day's worth of schedule for a date and callsign (async)", function(finished){
            var datestring = moment().format("YYYYMMDD");
            var callsign = "KQED",
                lc_callsign = callsign.toLowerCase();
            PBSApi.get_day_schedule_for_callsign_date_async(lc_callsign, datestring, function (err, results){
                results.must.be.an.object();
                results.callsign.must.equal(lc_callsign);
                results.datestring.must.equal(datestring);
                results.feeds.must.be.an.array();
                results.feeds[0].listings.must.be.an.array();
                finished();
            });
        });

        it("should get day's worth of schedule for a date and callsign (promises)", function(finished){
            var datestring = moment().format("YYYYMMDD");
            var callsign = "KQED",
                lc_callsign = callsign.toLowerCase();
            PBSApi.get_day_schedule_for_callsign_date(lc_callsign, datestring)
            .then(function(results){
                results.must.be.an.object();
                results.callsign.must.equal(lc_callsign);
                results.datestring.must.equal(datestring);
                results.feeds.must.be.an.array();
                results.feeds[0].listings.must.be.an.array();
                finished();
            })
            .done();
        });


    } else {
        it("Can't run some tests because of lack of api_key", function (finished) {
            assert(false, 'Missing api_key. Use: export PBS_TV_SCHEDULES_API_KEY="KEY"');
            finished();
        });
    }
});