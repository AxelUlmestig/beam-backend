var mqtt = require('mqtt');
var Beam = require('./beam');
var refreshBeams = require('./refresh_beams');
var reduceBeams = require('./reduce_beams');
var Constants = require('./constants');

var client = mqtt.connect(Constants.HOST);
var incomingChannel = Constants.PUBLISH_CHANNEL;
var outgoingChannel = Constants.UPDATES_CHANNEL;

var beams = [];

client.on('connect', function () {
        console.log('connected');
	client.subscribe(incomingChannel);
});
 
client.on('message', function (topic, message_buffer) {
        console.log('message received');
        var message = JSON.parse(message_buffer.toString());
        
        //TODO validate data
        var photon = Beam.createPhoton(message.lat, message.lon);
        beams.push(photon);
        beams = reduceBeams(beams);
        publish();
        setTimeout(publish, Constants.BEACON_DURATION * 1000);
});

function publish() {
        beams = refreshBeams(beams);
        client.publish(outgoingChannel, Beam.stringify(beams));
        console.log('published beams: ' + Beam.stringify(beams));
}
