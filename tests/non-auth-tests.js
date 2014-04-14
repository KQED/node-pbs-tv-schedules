var vows = require('vows'),
    assert = require('assert'),
    PBSTvSchedules = require('./../lib/node-pbs-tv-schedules');

var util = require('util');

vows.describe('PBS TV Schedules Tests').addBatch({
    'Auth Not Required:' : {
        topic: new PBSTvSchedules(),
        'Module should have get_stations_by_zip method': function (module) {
            assert.isFunction(module.get_stations_by_zip, 'module.get_stations_by_zip() is not a function!');
        },
        'When module looks up stations for 94110': {
            topic: function (module) {
                module.get_stations_by_zip(94110, this.callback);
            },
            'It should succeed': function (err, result) {
                assert.isNull(err);
                assert.ok(result);
            },
            'It should return an array': function (err, result) {
                assert.equal(typeof result, typeof []);
            },
            'It should return 3 stations': function (err, result) {
                assert.equal(result.length, 3);
            },
        },

        'When module looks up stations for nonexistant zip (11111)': {
            topic: function (module) {
                module.get_stations_by_zip("foo", this.callback);
            },
            'It should succeed': function (err, result) {
                assert.isNull(err);
                assert.ok(result);
            },
            'It should return an array': function (err, result) {
                assert.equal(typeof result, typeof []);
            },
            'It should return 0 stations': function (err, result) {
                assert.equal(result.length, 0);
            },
        },
    }
}).export(module);