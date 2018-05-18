s

var sender = datagram.createSocket('udp4');

// Initialisation of the instruments table (like in the SPEC)
var instruments = new Map();
instruments.set("piano", "ti-ta-ti");
instruments.set("trumpet", "pouet");
instruments.set("flute", "trulu");
instruments.set("violin", "gzi-gzi");
instruments.set("drum", "boum-boum");

// user Argument -> instrument
var instrument = process.argv[2];

//if the instrument doesn't exist, we quit the process
if(instruments.get(instrument) == undefined){
    process.on('exit', function(){
        console.log("Invalid instrument");
        process.exit(1);
    });
}

var musician = {
    "uuid" : uuid(),
    "sound" : instruments.get(instrument),
};

var payload = JSON.stringify(musician);

// Let's send this payload to all the subscriber of the multicast adresse
message = new Buffer(payload);
var update = function() {
    sender.send(message, 0, message.length, musicProtocol.UDP_PORT, musicProtocol.MULTICAST_ADRESS, function () {
        console.log("Sending payload: " + payload + " via port " + sender.address().port);
    });
}
// And let's do this every second
setInterval(update, 1000);