const config = require('./config');
const L2Crypt = require('./encryption/L2Crypt');
const BaseRecievePacket = require('./network/BaseRecievePacket');
const BaseSendablePacket = require('./network/BaseSendablePacket');
const opcode = require('./enums/opcode');

const ItemList = require('./network/serverpackets/ItemList');

class L2Client {
	constructor(socket) {
		this.crypt = new L2Crypt();
		this.socket = socket;
	}
	read(buffer){
		let size = ( buffer[1] << 8 ) | buffer[0];
		if (size > buffer.length){
			console.log('>>'.red + " size > buffer.length");
			return;
		}
		if (size != buffer.length)
			this.read(buffer.slice(size));
		
		buffer = buffer.slice(2, size);
		
		buffer = this.crypt.decrypt(buffer);
		
		this.helper(buffer, "in");
		let packet = new BaseRecievePacket(buffer);
		let code = packet.readC();
		try {
			(new (require("./network/clientpackets/" + opcode[code]))()).run(this, packet);
		} catch(err) {
			console.log(err);
			console.log(">>".red + " Packet 0x" + ("0" + code.toString(16)).substr(-2) + " " + opcode[code].green);
		}
	}
	async write(block) {
		let packet = new BaseSendablePacket();
		await block.write(packet);
		this.helper(packet.buffer(), "out");
		let data = this.crypt.encrypt(packet.buffer());
		let buffer = new Buffer.alloc(data.length + 2);
		for (let i = 0; i < data.length; ++i)
			buffer[i + 2] = data[i];
		buffer[0] = buffer.length & 0xFF;
		buffer[1] = (buffer.length >> 8) & 0xFF;
		this.socket.write(buffer);
	}
	helper(buffer, io = 'out') {
		console.log(' ');
		if (io == 'in') {
			console.log(('client->server length: ' + buffer.length + ' ').green);
			console.log('-----------------------------------------------------'.green);
		} else {
			console.log(('server->client length: ' + buffer.length + ' ').yellow);
			console.log('-----------------------------------------------------'.yellow);
		}
		console.log('0000  00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F'.blue);
		let block = '';
		for (var i =  0; i < buffer.length; ++i) {
			if (i%16 == 0 && i != 0) {
				console.log(('000' + (i-16).toString(16)).substr(-4) + ' ' + block);
				block = '';
			}
			block += " " + ("0" + buffer[i].toString(16)).substr(-2);
		}
		console.log(('000' + ((i > 16)?i:0).toString(16)).substr(-4) + ' ' + block);
		console.log(' ');
	}
	sendItemList(open) {
		this.write(new ItemList(this, open));
	}
}
module.exports = L2Client;