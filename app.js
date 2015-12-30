var mqtt = require('mqtt');
var constants = require('./beam_constants');
var track_beams = require('./track_beams');

var client  = mqtt.connect('mqtt://test.mosquitto.org');
var incoming_channel = constants.PUBLISH_CHANNEL;
var outgoing_channel = constants.UPDATES_CHANNEL;

var beams = [];

var update_beams = function(updated_beams) {
	beams = updated_beams;
	client.publish(outgoing_channel, JSON.stringify(beams));
}

client.on('connect', function () {
	client.subscribe(incoming_channel);
});
 
client.on('message', function (topic, message_buffer) {
	var beacon = JSON.parse(message_buffer.toString());
	//TODO validate beacon
	track_beams.add_beacon(beacon, beams, update_beams);
	setTimeout(function(){
		track_beams.refresh_beams(beams, update_beams);
	}, constants.BEACON_DURATION * 1000);
});
