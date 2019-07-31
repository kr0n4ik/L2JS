const colors = require('colors');
const Net = require('net');
const L2World = require('./world/L2World');
const L2Client = require('./L2Client');

class L2Server {
	start() {
		Net.createServer(function(socket) {
			L2World.add(new L2Client(socket));
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