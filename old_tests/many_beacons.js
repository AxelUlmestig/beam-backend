var beam_util = require('../beam');
var track_beams = require('../track_beams');

var random_beacon = function() {
	var lat = Math.random() * 1000;
	var lon = Math.random() * 1000;
	return beam_util.create_beacon(lat, lon);
}

var nbr_of_beacons = 1000;
var beacons = []
for(var i = 0; i < nbr_of_beacons; i++) {
	beacons.push(random_beacon());
}

var start_time = Date.now();
track_beams.reduce_beam_list(beacons, function(result){
	console.log(result.length);
	var end_time = Date.now();
	var time_elapsed = (end_time - start_time) / 1000;
	console.log('time elapsed: ' + time_elapsed);
	track_beams.add_beacon(random_beacon(), result, function(new_result){
		console.log(new_result.length);
	});
});
