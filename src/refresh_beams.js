const Beam = require('./beam');
const reduceBeams = require('./reduce_beams');
const Constants = require('../constants.json');

const refreshBeams = (timestamp, beams) =>
    beams
    .map(refreshBeam(timestamp))
    .reduce((all, refreshed) => all.concat(refreshed), [])

const refreshBeam = timestamp => beam => {
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
