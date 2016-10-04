var expect = require('chai').expect;
var Beam = require('../beam');
var Constants = require('../constants.json');
var reduceBeams = require('../reduce_beams');

describe('reduceBeams', function(){
        it('two close photons', function(){
                var p1 = Beam.createPhoton(0, 0);
                var p2 = Beam.createPhoton(0, 0);
                var beams = [p1, p2];
                var reduced = reduceBeams(beams);

                expect(reduced.length).to.equal(1);
                var joined = reduced.pop();
                var radius = Beam.getRadius(joined);
                var expectedRadius = Math.sqrt(2 * Math.pow(Beam.getRadius(p1), 2));
                expect(radius).to.equal(expectedRadius);
                expect(Beam.getPosition(joined)).to.deep.equal(Beam.getPosition(p1));
        });
        it('three close photons', function(){
                var p1 = Beam.createPhoton(0, 0);
                var p2 = Beam.createPhoton(0, 0);
                var p3 = Beam.createPhoton(0, 0);
                var beams = [p1, p2, p3];
                var reduced = reduceBeams(beams);

                expect(reduced.length).to.equal(1);
                var joined = reduced.pop();
                var radius = Beam.getRadius(joined);
                var expectedRadius = Math.sqrt(3 * Math.pow(Beam.getRadius(p1), 2));
                expect(radius).to.equal(expectedRadius);
                expect(Beam.getPosition(joined)).to.deep.equal(Beam.getPosition(p1));
        });
        it('two distant photons', function(){
                var p1 = Beam.createPhoton(0, 0);
                var p2 = Beam.createPhoton(100, 100);
                var beams = [p1, p2];
                var reduced = reduceBeams(beams);

                expect(reduced.length).to.equal(2);
                expect(Beam.getRadius(reduced[0])).to.equal(Constants.BEACON_RADIUS);
                expect(Beam.getRadius(reduced[1])).to.equal(Constants.BEACON_RADIUS);
        });
});
