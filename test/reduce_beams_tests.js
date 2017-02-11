const expect = require('chai').expect;
const Beam = require('../beam');
const Constants = require('../constants.json');
const reduceBeams = require('../reduce_beams');

describe('reduceBeams', () => {
    it('two close photons', () => {
        const p1 = Beam.createPhoton(0, 0);
        const p2 = Beam.createPhoton(0, 0);
        const beams = [p1, p2];
        const reduced = reduceBeams(beams);

        expect(reduced.length).to.equal(1);
        const joined = reduced.pop();
        const radius = Beam.getRadius(joined);
        const expectedRadius = Math.sqrt(2 * Math.pow(Beam.getRadius(p1), 2));
        expect(radius).to.equal(expectedRadius);
        expect(Beam.getPosition(joined)).to.deep.equal(Beam.getPosition(p1));
    });
    it('three close photons', () => {
        const p1 = Beam.createPhoton(0, 0);
        const p2 = Beam.createPhoton(0, 0);
        const p3 = Beam.createPhoton(0, 0);
        const beams = [p1, p2, p3];
        const reduced = reduceBeams(beams);

        expect(reduced.length).to.equal(1);
        const joined = reduced.pop();
        const radius = Beam.getRadius(joined);
        const expectedRadius = Math.sqrt(3 * Math.pow(Beam.getRadius(p1), 2));
        expect(radius).to.equal(expectedRadius);
        expect(Beam.getPosition(joined)).to.deep.equal(Beam.getPosition(p1));
    });
    it('two distant photons', () => {
        const p1 = Beam.createPhoton(0, 0);
        const p2 = Beam.createPhoton(100, 100);
        const beams = [p1, p2];
        const reduced = reduceBeams(beams);

        expect(reduced.length).to.equal(2);
        expect(Beam.getRadius(reduced[0])).to.equal(Constants.BEACON_RADIUS);
        expect(Beam.getRadius(reduced[1])).to.equal(Constants.BEACON_RADIUS);
    });
});
