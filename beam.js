var Vector = require('./vector');
var Constants = require('./constants');

createPhoton = function(lat, lon) {
        var timestamp = Date.now() / 1000;
        return {
                radius: Constants.BEACON_RADIUS,
                timestamp: timestamp,
                position: [lat, lon],
                isPhoton: true
        }
}

getPosition = function(beam) {
        if(beam.position) {
                return beam.position;
        }
        var position1 = getPosition(beam.beam1);
        var position2 = getPosition(beam.beam2);
        var weight1 = Math.pow(getRadius(beam.beam1), 2);
        var weight2 = Math.pow(getRadius(beam.beam2), 2);
        var weightedPos1 = Vector.multiply(position1, weight1);
        var weightedPos2 = Vector.multiply(position2, weight2);
        var sum = Vector.add(weightedPos1, weightedPos2);
        var weightedSum = Vector.multiply(sum, Math.pow(weight1 + weight2, -1));
        beam.position = weightedSum;
        return weightedSum;
}

getRadius = function(beam) {
        if(beam.radius) {
                return beam.radius;
        }
        var r1 = getRadius(beam.beam1);
        var r2 = getRadius(beam.beam2);
        beam.radius = Math.sqrt(Math.pow(r1, 2) + Math.pow(r2, 2));
        return beam.radius;
}

getTimestamp = function(beam) {
        if(beam.timestamp != null) {
                return beam.timestamp;
        }
        var ts1 = getTimestamp(beam.beam1);
        var ts2 = getTimestamp(beam.beam2);
        beam.timestamp = Math.min(ts1, ts2);
        return beam.timestamp;
}

getDistance = function(b1, b2) {
        var pos1 = getPosition(b1);
        var pos2 = getPosition(b2);
        var distance = Vector.distance(pos1, pos2);
        return distance;
}

addBeams = function(b1, b2) {
        return {
                beam1: b1,
                beam2: b2
        }
}

var simplify = function(beam) {
        var position = getPosition(beam);
        return {
                radius: getRadius(beam),
                lat: position[0],
                lon: position[1]
        }
}

stringify = function(beam) {
        if(Array.isArray(beam)) {
                var simpleBeams = beam.map(simplify);
                return JSON.stringify(simpleBeams);
        }
        var simplified = simplify(beam);
        return JSON.stringify(simplified);
}

module.exports = {
        createPhoton: createPhoton,
        getPosition: getPosition,
        getRadius: getRadius,
        getTimestamp: getTimestamp,
        getDistance: getDistance,
        addBeams: addBeams,
        stringify: stringify
}
