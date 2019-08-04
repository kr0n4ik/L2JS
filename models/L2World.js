class L2World {
	constructor() {
		this.map = [];
	}
	add(obj) {
		let guid = -1;
		let go = false;
		do {
			guid = (Math.random() * 0x7FFFFFFF) & 0xFFFFFFFF;
			for (let obj of this.map) 
				if (obj.guid == guid) {
					go = true;
					break;
				}
		} while (go);
		obj.guid = guid;
		this.map.push(obj);
	}
	timer(fps){
		for (let obj of this.map)
			if (obj.timer)
				obj.timer(fps);
	}
	read(socket, buffer) {
		for (let client of this.map)
			if (client.socket && client.socket == socket)
				client.read(buffer);
	}
	write(buffer, guid = null) {
		for (let client of l2world.map) {
			if (client && client.socket && client.online && client.guid != guid) {
				client.write(buffer);
			}
		}
	}
}
let l2world = new L2World();
module.exports = l2world;