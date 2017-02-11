const Beam = require('./beam');
const Constants = require('./constants.json');
const reduceBeams = require('./reduce_beams');

const refreshBeams = (timestamp, beams) =>
	beams.reduce((refreshed, beam) =>
        refreshed.concat(refreshBeam(timestamp, beam))
	, [])

const refreshBeam = (timestamp, beam) => {
    const beamTimestamp = Beam.getTimestamp(beam);
    const limit = timestamp - Constants.BEACON_DURATION;
    if(beamTimestamp > limit){
        return [beam];
    }
    if(beam.isPhoton) {
        return [];
    }
    return refreshBeams(timestamp, [beam.beam1, beam.beam2]);
}

module.exports = beams => {
    const timestamp = Date.now() / 1000;
    const refreshed = refreshBeams(timestamp, beams);
    return reduceBeams(refreshed);
}
