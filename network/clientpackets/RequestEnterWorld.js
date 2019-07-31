const UserInfo = require('../serverpackets/UserInfo');

class RequestEnterWorld {
	run(client, packet) {
		for (let i = 0; i < 20; i++)
			packet.readC();
		packet.readD(); // Unknown Value
		packet.readD(); // Unknown Value
		packet.readD(); // Unknown Value
		packet.readD(); // Unknown Value
		packet.readB(64); // Unknown Byte Array
		packet.readD(); // Unknown Value
		client.write(new UserInfo(client, 'POSITION', 'BASIC_INFO', 'COL_RADIUS_HEIGHT', 'INVENTORY_LIMIT', 'BASE_STATS'));
	}
}
module.exports = RequestEnterWorld;