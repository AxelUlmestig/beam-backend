/*
 * contains functions called on lists of beams/beacons
 */

var async = require('async');
var beam_util = require('./beam');

var add_beacon = function(beacon, beams, cb) {
	beams.push(beacon);
	reduce_beam_list(beams, cb);
}

var refresh_beam = function(beam, cb) {
	deconstruct_beams([beam], function(beacons) {
		async.filter(beacons, beam_util.is_active, function(active_beacons){
			reduce_beam_list(active_beacons, cb);
		});
	});
}

var refresh_beams = function(beams, cb) {
	var fresh_beams = [];
	async.each(beams, function(beam, each_cb) {
		if(beam_util.contains_inactive(beam)) {
			refresh_beam(beam, function(reconstructed_beams) {
				fresh_beams = fresh_beams.concat(reconstructed_beams);
				each_cb();
			});
		} else {
			fresh_beams.push(beam);
			each_cb();
		}
	}, function(err) {
		cb(fresh_beams);
	});
}

var reduce_beam_list = function(beams, cb) {
	beams.sort(function(a,b){
		return a.radius - b.radius;
	});
	for(i = 0; i < beams.length; i++) {
		var b1 = beams[i];
		for(j = 0; j < beams.length; j++) {
			if(j == i) {
				continue;
			}
			var b2 = beams[j];
			if(beam_util.beams_overlapping(b1, b2)) {
				beam_util.add_beam(b1, b2, function(err, sum){
					beams.splice(beams.indexOf(b1), 1);
					beams.splice(beams.indexOf(b2), 1);
					beams.push(sum);
					reduce_beam_list(beams, cb);
				});
				return;
			}
		}
	}
	cb(beams);
}

var deconstruct_beams = function(beams, cb) {
	var beacons = [];
	async.each(beams, function(beam, each_cb) {
		if(beam.beacons) {
			beacons = beacons.concat(beam.beacons);
		} else {
			beacons.push(beam);
		}
		each_cb(null);
	}, function(err) {
		cb(beacons);
	});
}

module.exports = {
	reduce_beam_list: reduce_beam_list,
	add_beacon: add_beacon,
	refresh_beams: refresh_beams
}
