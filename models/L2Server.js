const colors = require('colors');
const Net = require('net');
const L2World = require('./L2World');
const L2Session = require('./L2Session');

require("../tables/experience");

class L2Server {
	constructor() {
		this.time = 0;
	}
	start() {
		setInterval(() => {
			L2World.timer(Math.round(1/(Date.now() - this.time)));
			this.time = Date.now();
		}, 1);
		Net.createServer(function(socket) {
			L2World.add(new L2Session(socket));
			socket.on('data', function (buffer) {
				L2World.read(socket, buffer);
			});
			socket.on('close', function () {
				console.log(">>".green + "Client close");
			});
			socket.on('error', function (err) {
				console.log(">>".red + "Connect error");
				console.log(err);
			});
		}).listen(7777);
		console.log("[INFO]".green + " Server start port: " + 7777);
	}
}
module.exports = L2Server;