var Beam = require('./beam.js');
var Constants = require('./constants.js');
var reduceBeams = require('./reduce_beams.js');

var refreshBeams = function(timestamp, beams) {
        var refreshed = [];
        beams.forEach(function(beam) {
                var refreshedBeam = refreshBeam(timestamp, beam);
                refreshed = refreshed.concat(refreshedBeam);
        });
        return refreshed;
}

var refreshBeam = function(timestamp, beam) {
        var beamTimestamp = Beam.getTimestamp(beam);
        var limit = timestamp - Constants.BEACON_DURATION;
        if(beamTimestamp > limit){
                return [beam];
        }
        if(beam.isPhoton) {
                return [];
        }
        return refreshBeams(timestamp, [beam.beam1, beam.beam2]);
}

module.exports = function(beams) {
        var timestamp = Date.now() / 1000;
        var refreshed = refreshBeams(timestamp, beams);
        var reduced = reduceBeams(refreshed);
        return reduced;
}
