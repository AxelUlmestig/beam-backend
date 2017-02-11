const Beam = require('./beam');

/*
 * Check all the beams against all the other beams
 * one by one.
 * 'behind' contains the beams that are checked
 * and 'ahead' contains the beams are not checked.
 */
const reduceBeams = (behind, ahead) => {
    if(ahead.length == 0) {
        return behind;
    }
    const reducedAhead = reduceHead(ahead);
    behind.unshift(reducedAhead.shift());
    const reducedBehind = reduceHead(behind);
    return reduceBeams(reducedBehind, reducedAhead);
}

const reduceHead = beams => {
    let devourer = beams.shift();
    const output = [];
    beams.forEach(beam => {
        if(shouldMerge(devourer, beam)){
            devourer = Beam.addBeams(devourer, beam);
        } else {
            output.push(beam);
        }
    });
    output.unshift(devourer);
    return output;
}

const shouldMerge = (b1, b2) => {
    const mergedRad = Beam.getRadius(Beam.addBeams(b1, b2));
    const groupRad = 0.5 * (Beam.getDistance(b1, b2) + Beam.getRadius(b1) + Beam.getRadius(b2));
    return mergedRad >= groupRad;
}

module.exports = beams => reduceBeams([], beams)
