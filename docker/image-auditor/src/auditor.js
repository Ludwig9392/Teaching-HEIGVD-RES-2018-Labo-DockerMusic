// Protocol recup.
var musicProtocol = require('./musicProtocol');

// Node.js module for UDP for UUID
var uuid = require('uuid');

// Node.js module for UDP
var datagram = require('dgram');

// Node.js module for TCP
var net = require('net');

var sounds = new Map();
sounds.set("ti-ta-ti", "piano");
sounds.set("pouet", "trumpet");
sounds.set("trulu", "flute");
sounds.set("gzi-gzi", "violin");
sounds.set("boum-boum", "drum");

var musicians = new Map();

function removeMusician(uuid){
    musicians.delete(uuid);
}

var server = datagram.createSocket('udp4');
server.bind(musicProtocol.UDP_PORT, function () {
    console.log("new Musician comming...");
    server.addMembership(musicProtocol.MULTICAST_ADRESS);

});

server.on('message', function (msg, source) {
    console.log("Data has arrived: " + msg + ". Source IP: " + source.address + ". Source port: " + source.port);
    var sound = JSON.parse(msg);
    var uuid =  sound.uuid;
    var musician = musicians.get(uuid);

    if(musician === undefined) {
        var musician = {
            "instrument" : sounds.get(sound.sound),
            "activeSince" : Date.now(),
            "timeToLive" : setTimeout(removeMusician, 5000, uuid)
        };
        musicians.set(uuid, musician);
    }
    else {
        clearTimeout(musician.timeToLive);
        musician.timeToLive = setTimeout(removeMusician, 5000, uuid);
    }
});

var tcpServer = net.createServer( (socket) => {
    console.log("TCP connexion recieved, sending playing musicians...");
    var playingMusicians = [];
    musicians.forEach(function (musician, uuid, map) {
        playingMusicians.push({
            "uuid" : uuid,
            "instrument" : musician.instrument,
            "activeSince" : musician.activeSince
        });
    });
    socket.end(JSON.stringify(playingMusicians));
});

tcpServer.listen(musicProtocol.TCP_PORT);