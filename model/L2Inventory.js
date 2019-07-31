class L2Inventory {
	constructor() {
		this.items = [];
	}
	add(id) {
		this.items.push({'id': id, 'guid': 345});
	}
	get() {
		return this.items;
	}
}
module.exports = L2Inventory;