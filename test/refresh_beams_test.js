const expect = require('chai').expect;
const refreshBeams = require('../refresh_beams');
const Beam = require('../beam');

describe('refresh beams', () => {
    it('one old, one fresh', () => {
        const old = Beam.createPhoton(0, 0);
        old.timestamp = 0;
        const fresh = Beam.createPhoton(100, 100);
        const beams = [old, fresh];
        const refreshed = refreshBeams(beams);

        expect(refreshed.length).to.equal(1);
        const remainingBeam = refreshed[0];
        expect(remainingBeam).to.equal(fresh);
    });
    it('one old, one fresh in a beacon', () => {
        const old = Beam.createPhoton(0, 0);
        old.timestamp = 0;
        const fresh = Beam.createPhoton(0, 0);
        const beacon = Beam.addBeams(fresh, old);
        const refreshed = refreshBeams([beacon]);

        expect(refreshed.length).to.equal(1);
        const remainingBeam = refreshed[0];
        expect(remainingBeam).to.equal(fresh);
    });
    it('one old beacon, one fresh photon', () => {
        /*
         * The beacon should get replaced with 
         * it's fresh photon. That photon should
         * then get merged with the other photon
         * in the list. Resulting in a list of
         * one beacon containing two photons.
         */
        const old = Beam.createPhoton(100, 100);
        old.timestamp = 0;
        const fresh1 = Beam.createPhoton(0, 0);
        const fresh2 = Beam.createPhoton(0, 0);
        const beacon = Beam.addBeams(fresh1, old);
        const refreshed = refreshBeams([beacon, fresh2]);

        expect(refreshed.length).to.equal(1);
        const remainingBeam = refreshed[0];
        //the radius of a beacon consisting of two photons
        const expectedRadius = Math.sqrt(2 * Math.pow(fresh1.radius, 2));
        expect(Beam.getRadius(remainingBeam)).to.equal(expectedRadius);
    });
});
