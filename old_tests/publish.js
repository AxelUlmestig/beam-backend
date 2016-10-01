var mqtt = require('mqtt');
var beam_util = require('../beam');
var beam_constants = require('../beam_constants');

var client  = mqtt.connect('mqtt://test.mosquitto.org');
var incoming_channel = beam_constants.UPDATES_CHANNEL;
var outgoing_channel = beam_constants.PUBLISH_CHANNEL;
 
client.on('connect', function () {
	client.subscribe(incoming_channel);
	var lat = Math.random() * 10;
	var lon = Math.random() * 10;
	var beacon = beam_util.create_beacon(lat, lon);
	client.publish(outgoing_channel, JSON.stringify(beacon));
	setTimeout(function() {
		var beacon = beam_util.create_beacon(lat, lon);
		client.publish(outgoing_channel, JSON.stringify(beacon));
	}, 1000);
});

client.on('message', function(topic, message_buffer) {
	var message = message_buffer.toString();
	var beams = JSON.parse(message);
	console.log(beams);
	console.log('');
});
