vows.describe('PBS TV Schedules Tests').addBatch({
    'No Auth Required' : {
        topic: new PBSTvSchedules(),
        'Module should have get_stations_by_zip method': function (module) {
            assert.isFunction(module.get_stations_by_zip, 'module.get_stations_by_zip() is not a function!');
        },
        'When module looks up stations for 94110': {
            topic: function (module) {
            return module.get_stations_by_zip(94110);
            },
            'It should succeed with json': function (err, result) {
                assert.isNull(err);
                assert.ok(result);
                assert.equal(result.name, "PBSTvSchedules");
            }
        },
    }
});