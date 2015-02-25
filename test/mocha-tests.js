var demand  = require('must'),
    assert  = require('assert'),
    PBSTvSchedules = require('./../');

var testzip_good = 94110,
    testzip_bad = 11111;

var PBSApi = new PBSTvSchedules();
var api_key = process.env.PBS_TV_SCHEDULES_API_KEY || null;
PBSApi.set_api_key(api_key);
console.log("PBSApi.set_api_key(api_key);", api_key);
describe("PBSApi", function(){
    this.timeout(7000); // The PBS API is slow.

    it("must be creatable", function(){
        PBSApi.must.be.an.instanceof(PBSTvSchedules);
    });

    it("should get a list of callsigns for zip " + testzip_good + "  (async)", function(finished){
        PBSApi.get_callsigns_by_zip_async(testzip_good, function(err, results){
            results.must.be.an.array();
            results.length.must.equal(3);
            finished();
        });
    });

    it("should get a list of callsigns for zip " + testzip_good + " (promises)", function(finished){
        PBSApi.get_callsigns_by_zip(testzip_good)
        .then(function(results){
            results.must.be.an.array();
            results.length.must.equal(3);
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

    // **************** These fail without API KEY
    if (PBSApi.api_key) {
        it("should get a list of shows for a callsign (async)", function(finished){
            var program_id = 3190;
            var callsign = "KQED",
                lc_callsign = callsign.toLowerCase();

            PBSApi.get_upcoming_by_callsign_program_id_async(program_id, callsign, function(err, results){
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
            PBSApi.get_upcoming_by_callsign_program_id(program_id, callsign)
            .then(function(results){
                results.must.be.an.object();
                results.upcoming_episodes.must.be.an.array();
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