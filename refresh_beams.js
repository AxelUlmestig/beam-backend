var Beam = require('./beam');
var Constants = require('./constants.json');
var reduceBeams = require('./reduce_beams');

var refreshBeams = function(timestamp, beams) {
	return beams.reduce(function(refreshed, beam){
		var refreshedBeam = refreshBeam(timestamp, beam);
		return refreshed.concat(refreshedBeam);
	}, []);
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
