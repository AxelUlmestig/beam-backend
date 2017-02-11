const mqtt = require('mqtt');
const Beam = require('./beam');
const refreshBeams = require('./refresh_beams');
const reduceBeams = require('./reduce_beams');
const Constants = require('../constants');

const client = mqtt.connect(Constants.HOST);
const incomingChannel = Constants.PUBLISH_CHANNEL;
const outgoingChannel = Constants.UPDATES_CHANNEL;

let beams = [];

client.on('connect', () => {
    console.log('connected');
    client.subscribe(incomingChannel);
});
 
publish = () => {
    beams = refreshBeams(beams);
    const options = {
        retain: true
    };
    client.publish(outgoingChannel, Beam.stringify(beams), options);
    console.log('published beams: ' + Beam.stringify(beams));
}

client.on('message', (topic, message_buffer) => {
    console.log('message received');
    const message = JSON.parse(message_buffer.toString());

    //TODO validate data
    const photon = Beam.createPhoton(message.lat, message.lon);
    beams.push(photon);
    beams = reduceBeams(beams);
    publish();
    setTimeout(publish, Constants.BEACON_DURATION * 1000);
});
