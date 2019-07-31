class ItemList {
	constructor(client, open) {
		this.client = client;
		this.open = open;
	}
	write(packet){
		let items = [
		{
			'guid': 456546546, 
			'id': 456,
			'count': 5
		}
		];
		packet.writeC(0x11);
		packet.writeH(this.open);
		packet.writeH(items.length);
		for (let item of items) {
			packet.writeC(0x00);
			packet.writeD(item.guid); // ObjectId
			packet.writeD(item.id); // ItemId
			packet.writeC(0x00);//item.getItem().isQuestItem() || (item.getEquipped() == 1) ? 0xFF : item.getLocation()); // T1
			packet.writeQ(item.count); // Quantity
			packet.writeC(0x00);//item.getItem().getType2()); // Item Type 2 : 00-weapon, 01-shield/armor, 02-ring/earring/necklace, 03-questitem, 04-adena, 05-item
			packet.writeC(0x00); // Filler (always 0)
			packet.writeH(0); // Equipped : 00-No, 01-yes
			packet.writeQ(0); // Slot : 0006-lr.ear, 0008-neck, 0030-lr.finger, 0040-head, 0100-l.hand, 0200-gloves, 0400-chest, 0800-pants, 1000-feet, 4000-r.hand, 8000-r.hand
			packet.writeC(0); // Enchant level (pet level shown in control item)
			packet.writeC(0x01); // TODO : Find me
			packet.writeD(-1);
			packet.writeD(-1);
			packet.writeC(1); // GOD Item enabled = 1 disabled (red) = 0
		}
		return true;
	}
}
module.exports = ItemList;