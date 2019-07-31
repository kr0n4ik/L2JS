class Say2 {
	run(client, packet) {
		let text = packet.readS();
		let type = packet.readD();
		console.log(text);
		client.inventory.add(text);
		client.sendItemList(0);
	}
}
module.exports = Say2;