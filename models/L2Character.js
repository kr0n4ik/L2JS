const BaseSendablePacket = require('../network/BaseSendablePacket');
class L2Character {
	constructor() {
		this.guid = null;
		this.position = {
			'source': {'x':0,'y':0,'z':0,'o':0},
			'current': {'x':0,'y':0,'z':0,'o':0},
			'destiny': {'x':0,'y':0,'z':0,'o':0},
			'time':0
		};
		this.hp = {'cur': 0, 'max': 0};
		this.mp = {'cur': 0, 'max': 0};
		this.status = '';
		this.base = {
		};
	}
	setStatus(val) {
		this.status = val;
	}
	getStatus() {
		return this.status;
	}
	
	setName(val) {
		this.charname = val;
	}
	getName() {
		return this.charname;
	}
	getGUID() {
		return this.guid;
	}
    setTitle(val) {
		this.title = val;
	}
	getTitle() {
		return this.title;
	}
	setClanId(val) {
		this.clanid = parseInt(val);
	}
	getClanId() {
		return this.clanid;
	}
	setSex(val) {
		this.sex = parseInt(val);
	}
	getSex() {
		return this.sex;	
	}
	setRace(val) {
		this.race = val;
	}
	getRace() {
		return this.race;	
	}
	getX() {
		return this.position.current.x;
	}
	getY() {
		return this.position.current.y;
	}
	getZ() {
		return this.position.current.z;
	}
	setCurrentHp(val) {
		this.hp.cur = val;
	}
	getCurrentHp() {
		return this.hp.cur;
	}
	setCurrentMp(val) {
		this.mp.cur = val;
	}
	getCurrentMp() {
		return this.mp.cur;
	}
	setMaxHp(val) {
		this.hp.max = val;
	}
	getMaxHp(){
		return this.hp.max;
	}
	setMaxMp(val){
		this.mp.max = val;
	}
	getMaxMp(){
		return this.mp.max;
	}
	getSp() {
		return 0;
	}
	setClassId(val) {
		this.classid = val;
	}
	getClassId() {
		return this.classid;
	}
	getSTR(){
		return this.str;
	}
	getDEX() {
		return this.dex;
	}
	getCON() {
		return this.con;
	}
	getINT() {
		return this.int;
	}
	getWIT() {
		return this.wit;
	}
	getMEN() {
		return this.men;
	}
	getLUC() {
		return this.luc;
	}
	getCHA() {
		return this.cha;
	}
	
	timer(fps) {
		/*let time = Date.now();
		if (this.getStatus() == 'world') {
			if (time%1000 == 0 ) {
				let maxHp = this.getMaxHp();
				let hp = this.getCurrentHp();
				if (maxHp > hp) {
					hp += 12.3;
					this.setCurrentHp( (hp > maxHp) ? maxHp : hp);
					this.StatusUpdate([{'key':0x09,'val': this.getCurrentHp()}]);
				}
			}
		}
		*/
	}
	
	MoveToLocation() {
		let packet = new BaseSendablePacket(0x2F);
		packet.writeD(this.guid);
		
		packet.writeD(this.position.destiny.x);
		packet.writeD(this.position.destiny.y);
		packet.writeD(this.position.destiny.z);
		
		packet.writeD(this.position.current.x);
		packet.writeD(this.position.current.y);
		packet.writeD(this.position.current.z);
		this.write(packet.buffer());
	}
	/*StatusUpdate(vals){
		let packet = new BaseSendablePacket(0x18);
		packet.writeD(this.getGUID()); // casterId
		packet.writeD(0);
		packet.writeC(0x00);
		packet.writeC(vals.length);
		for (let val of vals){
			packet.writeC(val.key);
			packet.writeD(val.val);
		}
		this.write(packet.buffer());
	}*/
}
module.exports =  L2Character;