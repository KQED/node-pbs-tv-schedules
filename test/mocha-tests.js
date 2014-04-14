var demand  = require('must'),
    PBSTvSchedules = require('./../lib/node-pbs-tv-schedules');

var testzip_good = 94110,
    testzip_bad = 11111;

var PBSApi = new PBSTvSchedules();
var api_key = process.env.PBS_API_KEY || null;
PBSApi.set_api_key(api_key);
describe("PBSApi", function(){
    it("must be creatable", function(){
        PBSApi.must.be.an.instanceof(PBSTvSchedules);
    });

    it("should get a list of callsigns for zip " + testzip_good + "  (async)", function(finished){
        PBSApi.get_stations_by_zip_async(testzip_good, function(err, results){
            results.must.be.an.array();
            results.length.must.equal(3);
            finished();
        });
    });

    it("should get a list of callsigns for zip " + testzip_good + " (promises)", function(finished){
        var testzip = 94110;
        PBSApi.get_stations_by_zip(testzip_good)
        .then(function(results){
            results.must.be.an.array();
            results.length.must.equal(3);
            finished();
        })
        .done();
    });

    // **************** These fail without API KEY
    if (PBSApi.api_key) {
        it("should get a list of shows for a callsign (async)", function(finished){
            var program_id = 3190;
            var callsign = "KQED";

            PBSApi.get_upcoming_programs_by_callsign_async(program_id, callsign, function(err, results){
                demand(err).be.null();
                results.must.be.an.array();
                finished();
            });
        });

        it("should get a list of shows for a callsign (promises)", function(finished){
            var program_id = 3190;
            var callsign = "KQED";
            PBSApi.get_upcoming_programs_by_callsign(program_id, callsign)
            .then(function(results){
                results.must.be.an.array();
                finished();
            })
            .done();
        });
    } else {
        it("Can't run some tests because of lack of api_key", function (finished) {
            finished();
        });
    }
});