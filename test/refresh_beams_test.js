var expect = require('chai').expect;
var refreshBeams = require('../refresh_beams');
var Beam = require('../beam');

describe('refresh beams', function(){
        it('one old, one fresh', function(){
                var old = Beam.createPhoton(0, 0);
                old.timestamp = 0;
                var fresh = Beam.createPhoton(100, 100);
                var beams = [old, fresh];
                var refreshed = refreshBeams(beams);

                expect(refreshed.length).to.equal(1);
                var remainingBeam = refreshed[0];
                expect(remainingBeam).to.equal(fresh);
        });
        it('one old, one fresh in a beacon', function(){
                var old = Beam.createPhoton(0, 0);
                old.timestamp = 0;
                var fresh = Beam.createPhoton(0, 0);
                var beacon = Beam.addBeams(fresh, old);
                var refreshed = refreshBeams([beacon]);

                expect(refreshed.length).to.equal(1);
                var remainingBeam = refreshed[0];
                expect(remainingBeam).to.equal(fresh);
        });
        it('one old beacon, one fresh photon', function(){
                /*
                 * The beacon should get replaced with 
                 * it's fresh photon. That photon should
                 * then get merged with the other photon
                 * in the list. Resulting in a list of
                 * one beacon containing two photons.
                 */
                var old = Beam.createPhoton(100, 100);
                old.timestamp = 0;
                var fresh1 = Beam.createPhoton(0, 0);
                var fresh2 = Beam.createPhoton(0, 0);
                var beacon = Beam.addBeams(fresh1, old);
                var refreshed = refreshBeams([beacon, fresh2]);

                expect(refreshed.length).to.equal(1);
                var remainingBeam = refreshed[0];
                //the radius of a beacon consisting of two photons
                var expectedRadius = Math.sqrt(2 * Math.pow(fresh1.radius, 2));
                expect(Beam.getRadius(remainingBeam)).to.equal(expectedRadius);
        });
});
