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
	beacon.timestamp = Math.floor(Date.now() / 1000);
	//TODO validate beacon
	track_beams.add_beacon(beacon, beams, update_beams);
	setTimeout(function(){
		track_beams.refresh_beams(beams, update_beams);
	}, constants.BEACON_DURATION * 1000);
});



/*
 * Bluemix refuses to run the program without a web server, so here's the template code for it...
 *
 */

/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
