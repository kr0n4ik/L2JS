class L2World {
	constructor() {
		this.map = [];
	}
	add(obj) {
		this.map.push(obj);
	}
	read(socket, buffer) {
		for (let client of this.map)
			if (client.socket && client.socket == socket && client.read)
				client.read(buffer);
	}
	write(buffer, guid = null) {
		for (let client of l2world.map)
			if (client && client.socket && client.online && client.guid != guid && client.write)
				client.write(buffer);
	}
}
let l2world = new L2World();
module.exports = l2world;