class ExPacket {
	run(client, packet) {
		let excode = packet.readH();
		console.log(excode);
	}
}
module.exports = ExPacket;