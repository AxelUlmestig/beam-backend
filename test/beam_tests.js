var expect = require('chai').expect;
var mathjs = require('mathjs');
var Beam = require('../beam.js');
var Constants = require('../beam_constants.js');

describe('basic beam functions', function(){
        describe('photon', function(){
                it('radius', function(){
                        var beacon = Beam.createPhoton(1, 2);
                        var radius = Beam.getRadius(beacon);
                        expect(radius).to.equal(Constants.BEACON_RADIUS);
                });
                it('position', function(){
                        var lat1 = 1;
                        var lon1 = 2;
                        var beacon = Beam.createPhoton(lat1, lon1);
                        var position = Beam.getPosition(beacon);
                        var lat2 = mathjs.subset(position, mathjs.index(0));
                        var lon2 = mathjs.subset(position, mathjs.index(1));
                        expect(lat1).to.equal(lat2);
                        expect(lon1).to.equal(lon2);
                });
                it('distance', function(){
                        var b1 = Beam.createPhoton(0, 0);
                        var b2 = Beam.createPhoton(3, 4);
                        var distance = getDistance(b1, b2);
                        expect(distance).to.be.closeTo(5, 0.001);
                });
                it('timestamp', function(){
                        var p = Beam.createPhoton(0, 0);
                        var ts = Beam.getTimestamp(p);
                        expect(ts).to.equal(p.timestamp);
                });
        });
        describe('beam', function(){
                it('radius', function(){
                        var b1 = Beam.createPhoton(1, 2);
                        var b2 = Beam.createPhoton(1, 2);
                        var beam = Beam.addBeams(b1, b2);
                        var radius = Beam.getRadius(beam);
                        var expectedRadius = Math.sqrt(2 * Math.pow(Constants.BEACON_RADIUS, 2));
                        expect(radius).to.equal(expectedRadius);
                });
                it('position', function(){
                        var b1 = Beam.createPhoton(10, 10);
                        var b2 = Beam.createPhoton(20, 30);
                        var beam = Beam.addBeams(b1, b2);
                        var position = Beam.getPosition(beam);
                        var lat = mathjs.subset(position, mathjs.index(0));
                        var lon = mathjs.subset(position, mathjs.index(1));
                        expect(lat).to.equal(15);
                        expect(lon).to.equal(20);
                });
                it('distance', function(){
                        var b1 = Beam.createPhoton(0, 0);
                        var b2 = Beam.createPhoton(6, 8);
                        var beam = Beam.addBeams(b1, b2);
                        var distance = getDistance(b1, beam);
                        expect(distance).to.be.closeTo(5, 0.001);
                });
                it('timestamp', function(){
                        var p1 = Beam.createPhoton(0, 0);
                        var p2 = Beam.createPhoton(1, 1);
                        p1.timestamp = 0;
                        var beacon = Beam.addBeams(p1, p2);
                        var ts = Beam.getTimestamp(beacon);
                        expect(ts).to.equal(Math.min(p1.timestamp, p2.timestamp));
                });
        });
});
