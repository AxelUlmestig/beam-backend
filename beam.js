/*
 * Contains functins applied to indiviual beams or beacons
 */

var async = require('async');
var constants = require('./beam_constants');
var BEACON_RADIUS = constants.BEACON_RADIUS;
var BEACON_DURATION = constants.BEACON_DURATION;

var create_beacon = function(lat, lon) {
	return {
		lat: lat,
		lon: lon,
		radius: BEACON_RADIUS,
		timestamp: Math.floor(Date.now() / 1000)
	};
}

var create_beam = function(beacon) {
	if(beacon.beacons) {
		return beacon;
	}
	return {
		lat: beacon.lat,
		lon: beacon.lon,
		radius: beacon.radius,
		beacons: [beacon]
	};
}

var get_distance = function(b1, b2) {
	lat_diff = b1.lat - b2.lat;
	lon_diff = b1.lon - b2.lon;
	return Math.sqrt(Math.pow(lat_diff, 2) + Math.pow(lon_diff, 2));
}

var beams_overlapping = function(b1, b2) {
	var r1 = b1.radius;
	var r2 = b2.radius;
	var r1_2 = Math.pow(r1, 2);
	var r2_2 = Math.pow(r2, 2);
	var diff = get_distance(b1, b2);
	return diff < 2*Math.sqrt(r1_2 + r2_2) - r1 - r2;
}

var update_position = function(b, cb) {
	var pos = {
		lat: 0,
		lon: 0
	};
	async.reduce(b.beacons, pos, function(memo, beacon, cb) {
		memo.lat += beacon.lat;
		memo.lon += beacon.lon;
		cb(null, memo);
	}, function(err, result) {
		b.lat = result.lat / b.beacons.length;
		b.lon = result.lon / b.beacons.length;
		cb();
	});
}

var update_radius = function(b, cb) {
	async.reduce(b.beacons, 0, function(memo, beacon, cb) {
		var radius = beacon.radius;
		cb(null, memo + radius * radius);
	}, function(err, square_sums){
		var new_radius = Math.sqrt(square_sums);
		b.radius = new_radius;
		cb();
	});
}

var update_beam = function(b, cb) {
	async.series([function(cb) {
		update_position(b, cb);
	}, function(cb) {
		update_radius(b, cb);
	}], cb);
}

var add_beam = function(b1, b2, cb) {
	var b1 = create_beam(b1);
	var b2 = create_beam(b2);
	b1.beacons = b1.beacons.concat(b2.beacons);
	update_beam(b1, function(error){
		cb(error, b1);
	});
}

var is_active = function(beacon, cb) {
	var now = Math.floor(Date.now() / 1000);
	var active = beacon.timestamp > now - BEACON_DURATION;
	if(cb) {
		cb(active);
	}
	return active;
}

module.exports = {
	create_beacon: create_beacon,
	create_beam: create_beam,
	add_beam: add_beam,
	beams_overlapping: beams_overlapping,
	is_active: is_active
}
