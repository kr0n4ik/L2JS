class CharacterSelected {
	constructor(client) {
		this.client = client;
	}
	write(packet){
		packet.writeC(0x0B);
		packet.writeS(this.client.name);
		packet.writeD(this.client.guid);
		packet.writeS(this.client.title);
		packet.writeD(this.client.session);
		packet.writeD(this.client.clanid);
		packet.writeD(0x00); // ??
		packet.writeD(this.client.sex);
		packet.writeD(this.client.race);
		packet.writeD(this.client.classid);
		packet.writeD(0x01); // active ??
		packet.writeD(this.client.x);
		packet.writeD(this.client.y);
		packet.writeD(this.client.z);
		packet.writeF(this.client.curHp);
		packet.writeF(this.client.curMp);
		packet.writeQ(this.client.sp);
		packet.writeQ(this.client.exp);
		packet.writeD(this.client.level);
		packet.writeD(this.client.reputation);
		packet.writeD(this.client.pkkills);
		packet.writeD(Date.now() % (24 * 60)); // "reset" on 24th hour
		packet.writeD(0x00);
	
		packet.writeD(this.client.classid);
		
		packet.writeB(new Buffer.alloc(16));
		
		packet.writeD(0x00);
		packet.writeD(0x00);
		packet.writeD(0x00);
		packet.writeD(0x00);
		
		packet.writeD(0x00);
		
		packet.writeD(0x00);
		packet.writeD(0x00);
		packet.writeD(0x00);
		packet.writeD(0x00);
		
		packet.writeB(new Buffer.alloc(28));
		packet.writeD(0x00);
		return true;
	}
}
module.exports = CharacterSelected;