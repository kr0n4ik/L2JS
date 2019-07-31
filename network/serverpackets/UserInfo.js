class UserInfo {
	constructor(client, ...flags) {
		this.client = client;
		this.size = 5;
		this.masks = [0x00, 0x00, 0x00];
		for (let flag of flags) {
			switch (flag) {
				case 'RELATION': this.size += 4; this.masks[0] |= 0x80; break; //RELATION
				case 'BASIC_INFO': this.size += (16 + this.client.name.length * 2); this.masks[0] |= 0x40; break; //BASIC_INFO
				case 'BASE_STATS': this.size += 18; this.masks[0] |= 0x20; break; //BASE_STATS
				case 'MAX_HPCPMP': this.size += 14; this.masks[0] |= 0x10; break; //MAX_HPCPMP
				case 'CURRENT_HPMPCP_EXP_SP': this.size += 38; this.masks[0] |= 0x08; break; //CURRENT_HPMPCP_EXP_SP
				case 'ENCHANTLEVEL': this.size += 4; this.masks[0] |= 0x04; break; //ENCHANTLEVEL
				case 'APPAREANCE': this.size += 15; this.masks[0] |= 0x02; break; //APPAREANCE
				case 'STATUS': this.size += 6; this.masks[0] |= 0x01; break; //STATUS
				
				case 'STATS': this.size += 56; this.masks[1] |= 0x80; break; //STATS
				case 'ELEMENTALS': this.size += 14; this.masks[1] |= 0x40; break; //ELEMENTALS
				case 'POSITION': this.size += 18; this.masks[1] |= 0x20; break; //POSITION
				case 'SPEED': this.size += 18; this.masks[1] |= 0x10; break; //SPEED
				case 'MULTIPLIER': this.size += 18; this.masks[1] |= 0x08; break; //MULTIPLIER
				case 'COL_RADIUS_HEIGHT': this.size += 18; this.masks[1] |= 0x04; break; //COL_RADIUS_HEIGHT
				case 'ATK_ELEMENTAL': this.size += 5; this.masks[1] |= 0x02; break; //ATK_ELEMENTAL
				case 'CLAN': this.size += 32; this.masks[1] |= 0x01; break; //CLAN
				
				case 'SOCIAL': this.size += 22; this.masks[2] |= 0x80; break; //SOCIAL
				case 'VITA_FAME': this.size += 15; this.masks[2] |= 0x40; break; //VITA_FAME
				case 'SLOTS': this.size += 9; this.masks[2] |= 0x20; break; //SLOTS
				case 'MOVEMENTS': this.size += 4; this.masks[2] |= 0x10; break; //MOVEMENTS
				case 'COLOR': this.size += 10; this.masks[2] |= 0x08; break; //COLOR
				case 'INVENTORY_LIMIT': this.size += 9; this.masks[2] |= 0x04; break; //INVENTORY_LIMIT
				case 'TRUE_HERO': this.size += 9; this.masks[2] |= 0x02; break; //TRUE_HERO
			}
		}
	}
	write(packet){
		packet.writeC(0x32);
		packet.writeD(this.client.guid);
		packet.writeD(this.size);
		packet.writeH(23);
		packet.writeB(this.masks);
		
		if ((this.masks[0] & 0x40) != 0){
			packet.writeH(16 + this.client.name.length * 2);
			packet.writeT(this.client.name);
			packet.writeC(0x00);
			packet.writeC(this.client.race);
			packet.writeC(this.client.sex);
			packet.writeD(this.client.classId);
			packet.writeD(this.client.classId);
			packet.writeC(this.client.level);
		}
		
		if ((this.masks[0] & 0x20) != 0){
			packet.writeH(18);
			packet.writeH(1);
			packet.writeH(2);
			packet.writeH(3);
			packet.writeH(4);
			packet.writeH(5);
			packet.writeH(6);
			packet.writeH(7);
			packet.writeH(8);
		}
		
		if ((this.masks[1] & 0x20) != 0) {
			packet.writeH(18);
			packet.writeD(this.client.x);
			packet.writeD(this.client.y);
			packet.writeD(this.client.z);
			packet.writeD(0);
		}
		
		if ((this.masks[1] & 0x04) != 0) {
			packet.writeH(18);
			packet.writeF(8.0);
			packet.writeF(23.5);
		}
		
		if ((this.masks[2] & 0x04) != 0) {
			packet.writeH(9);
			packet.writeH(0x00);
			packet.writeH(0x00);
			packet.writeH(50);
			packet.writeC(5);
		}
		return true;
	}
}
module.exports = UserInfo;