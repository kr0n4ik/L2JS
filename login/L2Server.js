const colors = require('colors');
const net = require('net');
const L2Client = require('./L2Client');
let l2client;
class L2Server {
	start() {
		net.createServer(function(socket) {
			l2client = new L2Client(socket);
			socket.on('data', function (buffer) {
				l2client.read(buffer);
			});
			socket.on('close', function () {
				console.log('[INFO]: '.green + "Client close");
			});
			socket.on('error', function (err) {
				console.log('[ERROR]: '.red + "Connect error");
				console.log(err);
			});
		}).listen(2106);
		console.log("[INFO]".green + " Server start port: " + 2106);
	}
}
module.exports = L2Server;