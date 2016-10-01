var Beam = require('./beam2.js');

var reduceBeams = function(beams) {
        if(beams.length <= 1) {
                return beams;
        }
        var current = beams.shift();
        return reduceBeamsInternal([], current, beams);
}

var reduceBeamsInternal = function(behind, current, before) {
        var reducedBefore = reduceHead(current, before);
        current = reducedBefore.pop();
        var reducedBehind = reduceHead(current, behind);
        current = reducedBefore.shift();
        if(!current) {
                return reducedBehind;
        }
        return reduceBeamsInternal(reducedBehind, current, reducedBefore);
}

var reduceHead = function(devourer, beams) {
        var output = [];
        beams.forEach(function(beam) {
                if(shouldMerge(devourer, beam)){
                        devourer = Beam.addBeams(devourer, beam);
                } else {
                        output.push(beam);
                }
        });
        output.push(devourer);
        return output;
}

var shouldMerge = function(b1, b2) {
        var mergedRad = Beam.getRadius(Beam.addBeams(b1, b2));
        var groupRad = 0.5 * (Beam.getDistance(b1, b2) + Beam.getRadius(b1) + Beam.getRadius(b2));
        return mergedRad >= groupRad;
}

module.exports = reduceBeams
