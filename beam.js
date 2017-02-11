const Vector = require('./vector');
const Constants = require('./constants.json');

const createPhoton = (lat, lon) =>
    ({
        radius: Constants.BEACON_RADIUS,
        timestamp: Date.now() / 1000,
        position: [lat, lon],
        isPhoton: true
    })

const getPosition = beam => {
    if(beam.position) {
        return beam.position;
    }
    const position1 = getPosition(beam.beam1);
    const position2 = getPosition(beam.beam2);
    const weight1 = Math.pow(getRadius(beam.beam1), 2);
    const weight2 = Math.pow(getRadius(beam.beam2), 2);
    const weightedPos1 = Vector.multiply(position1, weight1);
    const weightedPos2 = Vector.multiply(position2, weight2);
    const sum = Vector.add(weightedPos1, weightedPos2);
    const weightedSum = Vector.multiply(sum, Math.pow(weight1 + weight2, -1));
    beam.position = weightedSum;
    return weightedSum;
}

const getRadius = beam => {
    if(beam.radius) {
        return beam.radius;
    }
    const r1 = getRadius(beam.beam1);
    const r2 = getRadius(beam.beam2);
    beam.radius = Math.sqrt(Math.pow(r1, 2) + Math.pow(r2, 2));
    return beam.radius;
}

const getTimestamp = beam => {
    if(beam.timestamp != null) {
        return beam.timestamp;
    }
    const ts1 = getTimestamp(beam.beam1);
    const ts2 = getTimestamp(beam.beam2);
    beam.timestamp = Math.min(ts1, ts2);
    return beam.timestamp;
}

const getDistance = (b1, b2) => {
    const pos1 = getPosition(b1);
    const pos2 = getPosition(b2);
    return Vector.distance(pos1, pos2);
}

const addBeams = (b1, b2) => ({
    beam1: b1,
    beam2: b2
})

const simplify = beam =>{
    const position = getPosition(beam);
    return {
        radius: getRadius(beam),
        lat: position[0],
        lon: position[1]
    }
}

const stringify = beam => {
    if(Array.isArray(beam)) {
        const simpleBeams = beam.map(simplify);
        return JSON.stringify(simpleBeams);
    }
    const simplified = simplify(beam);
    return JSON.stringify(simplified);
}

module.exports = {
    createPhoton:   createPhoton,
    getPosition:    getPosition,
    getRadius:      getRadius,
    getTimestamp:   getTimestamp,
    getDistance:    getDistance,
    addBeams:       addBeams,
    stringify:      stringify
}
