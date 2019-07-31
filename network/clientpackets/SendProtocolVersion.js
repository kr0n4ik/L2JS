const config = require('../../config');
const KeyPacket = require('../serverpackets/KeyPacket');
class SendProtocolVersion {
	constructor() {
		
	}
	run(client, packet) {
		let version = packet.readD();
		if (version == -2 ) {
			client.socket.end();
			return;
		}
		if (config.protocol_list.indexOf(version)) {
			console.log("[WARNING]".red + " Wrong protocol version 0x" + version.toString(16));
			this.client.socket.end();
			return;
		}
		client.key = client.crypt.key();
		client.write(new KeyPacket(client.key));
		return true;
	}
}
module.exports = SendProtocolVersion;