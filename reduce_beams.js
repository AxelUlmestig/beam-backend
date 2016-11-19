var Beam = require('./beam');

var reduceBeams = beams => reduceBeamsInternal([], beams)

var reduceBeamsInternal = function(behind, ahead) {
        if(ahead.length == 0) {
                return behind;
        }
        var reducedAhead = reduceHead(ahead);
        behind.unshift(reducedAhead.shift());
        var reducedBehind = reduceHead(behind);
        return reduceBeamsInternal(reducedBehind, reducedAhead);
}

var reduceHead = function(beams) {
        var devourer = beams.shift();
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
