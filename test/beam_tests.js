const expect = require('chai').expect;
const Vector = require('../vector');
const Beam = require('../beam');
const Constants = require('../constants.json');

describe('basic beam functions', () => {
    describe('photon', () => {
        it('radius', () => {
            const beacon = Beam.createPhoton(1, 2);
            const radius = Beam.getRadius(beacon);
            expect(radius).to.equal(Constants.BEACON_RADIUS);
        });
        it('position', () => {
            const lat1 = 1;
            const lon1 = 2;
            const beacon = Beam.createPhoton(lat1, lon1);
            const position = Beam.getPosition(beacon);
            const lat2 = position[0];
            const lon2 = position[1];
            expect(lat1).to.equal(lat2);
            expect(lon1).to.equal(lon2);
        });
        it('distance', () => {
            const b1 = Beam.createPhoton(0, 0);
            const b2 = Beam.createPhoton(3, 4);
            const distance = getDistance(b1, b2);
            expect(distance).to.be.closeTo(5, 0.001);
        });
        it('timestamp', () => {
            const p = Beam.createPhoton(0, 0);
            const ts = Beam.getTimestamp(p);
            expect(ts).to.equal(p.timestamp);
        });
    });
    describe('beam', () => {
        it('radius', () => {
            const b1 = Beam.createPhoton(1, 2);
            const b2 = Beam.createPhoton(1, 2);
            const beam = Beam.addBeams(b1, b2);
            const radius = Beam.getRadius(beam);
            const expectedRadius = Math.sqrt(2 * Math.pow(Constants.BEACON_RADIUS, 2));
            expect(radius).to.equal(expectedRadius);
        });
        it('position', () => {
            const b1 = Beam.createPhoton(10, 10);
            const b2 = Beam.createPhoton(20, 30);
            const beam = Beam.addBeams(b1, b2);
            const position = Beam.getPosition(beam);
            const lat = position[0];
            const lon = position[1];
            expect(lat).to.equal(15);
            expect(lon).to.equal(20);
        });
        it('distance', () => {
            const b1 = Beam.createPhoton(0, 0);
            const b2 = Beam.createPhoton(6, 8);
            const beam = Beam.addBeams(b1, b2);
            const distance = getDistance(b1, beam);
            expect(distance).to.be.closeTo(5, 0.001);
        });
        it('timestamp', () => {
            const p1 = Beam.createPhoton(0, 0);
            const p2 = Beam.createPhoton(1, 1);
            p1.timestamp = 0;
            const beacon = Beam.addBeams(p1, p2);
            const ts = Beam.getTimestamp(beacon);
            expect(ts).to.equal(Math.min(p1.timestamp, p2.timestamp));
        });
    });
});
