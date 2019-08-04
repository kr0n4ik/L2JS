//CPlayer* otherclient = (CPlayer*)
const L2Sql = require('./L2Sql');
const L2Crypt = require('../encryption/L2Crypt');
const BaseRecievePacket = require('../network/BaseRecievePacket');
const BaseSendablePacket = require('../network/BaseSendablePacket');
const L2Character = require('./L2Character');
const config = require('../config');

const experience = require("../tables/experience");

class L2Session extends  L2Character{
	constructor(socket) {
		super();
		this.socket = socket;
		this.crypt = new L2Crypt();
		this.ping = Date.now();
		this.cp = {'cur':0, 'max':0};
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
		let opcode = packet.readC();
		switch(opcode) {
			//case 0x01: this.Attack(packet); break;
			case 0x0E: this.SendProtocolVersion(packet); break;
			//case 0x0F: this.MoveBackwardToLocation(packet); break;
			case 0x11: this.RequestGameStart(packet); break;
			case 0x12: this.CharacterSelect(packet); break;
			//case 0x1F: this.Action(packet); break;
			case 0x2B: this.RequestLogin(packet); break;
			//case 0x59: this.ValidateLocation(packet); break;
			case 0xD0: 
				let excode = packet.readH();
				switch(excode) {
					case 0x138: break;
					//case 0x33: this.CharSelectionInfo(); break;
					//case 0x0024: this.RequestSaveInventoryOrder(packet); break;
					default:
						console.log('>>'.red + "Execode packet. Command: 0x" + ("0" + excode.toString(16).toUpperCase()).substr(-4));
					break;
				}
			break;
			default:
				console.log('>>'.red + "Unknown packet 0x" + ("0" + opcode.toString(16).toUpperCase()).substr(-2));
			break;
		}
		this.ping = Date.now();
	}
	write(packet) {
		this.helper(packet, "out");
		let data = this.crypt.encrypt(packet);
		let buffer = new Buffer.alloc(data.length + 2);
		for (let i = 0; i < data.length; ++i)
			buffer[i + 2] = data[i];
		buffer[0] = buffer.length & 0xFF;
		buffer[1] = (buffer.length >> 8) & 0xFF;
		this.socket.write(buffer);
	}
	helper(buffer, io = 'out') {
		let  incode = require("../enums/opcode");
		let  outcode = require("../enums/opcode2");
		let code = buffer[0];
		console.log(' ');
		if (io == 'in') {
			console.log(('client->server length: ' + buffer.length + ' (0x' + ("0" + code.toString(16).toUpperCase()).substr(-2) +') ').green + "" + (incode[code]).yellow);
			console.log('-----------------------------------------------------'.green);
		} else {
			console.log(('server->client length: ' + buffer.length + ' (0x' + ("0" + code.toString(16).toUpperCase()).substr(-2) +') ').yellow + "" + (outcode[code]).green);
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
	
	setAccount(val){
		this.account = val;
	}
	getAccount() {
		return this.account;
	}
	setSession(val) {
		this.session = val;
	}
	getSession() {
		return this.session;
	}
	setSlot(val) {
		this.slot = val;
	}
	getSlot() {
		return this.slot;
	}
	setLevel(val) {
		this.level = val;
	}
	getLevel(){
		return this.level;
	}
	setExp(val) {
		this.exp = val;
	}
	getExp(){
		return this.exp;
	}
	getSp(){
		return this.sp;
	}
	setSp(val) {
		this.sp = val;
	}
	getMaxCp() {
		return this.cp.max;
	}
	getCurrentCp(){
		return this.cp.cur;
	}
	setReputation(val){
		this.reputation = val;
	}
	getReputation(){
		return this.reputation;
	}
	getPkKills() {
		return this.pkkills;
	}
	setPkKills(val){
		this.pkkills = val;
	}
	isGM() {
		return 0x00;
	}
	
	
	SendProtocolVersion(packet) {
		let version = packet.readD();
		if (version == -2 ) {
			this.socket.end();
			return;
		}
		if (config.protocol_list.indexOf(version)) {
			console.log(">>".red + "Wrong protocol version 0x" + version.toString(16));
			this.socket.end();
			return;
		}
		this.key = this.crypt.key();
		this.VersionCheck();
	}
	VersionCheck(result = 'OK') {
		switch(result) {
			case 'OK': result = 1; break;
			default: 
				result = 0; 
		}
		let packet = new BaseSendablePacket(0x2e);
		packet.writeC(result); // 0 - wrong protocol, 1 - protocol ok
		for (let i = 0; i < 8; ++i)
			packet.writeC(this.key[i]); // key
		packet.writeD(0x01);
		packet.writeD(config.server_id); // server id
		packet.writeC(0x01);
		packet.writeD(0x00); // obfuscation key
		packet.writeC(((config.server_list_type & 0x400) == 0x400 ) ? 0x01 : 0x00); 
		this.write(packet.buffer());
	}
	RequestLogin(packet) {
		/*Тут просиходит обмен с логином и проверка ланныйх */
		let account = packet.readS().toLowerCase();
		let playKey2 = packet.readD();
		let playKey1 = packet.readD();
		let loginKey1 = packet.readD();
		let loginKey2 = packet.readD();
		if (account.length < 1 || !this.key) {
			this.socket.end();
			return;
		}
		console.log(playKey2.toString(16) + " " + playKey1.toString(16) + " " + loginKey1.toString(16) + " " + loginKey2.toString(16));
		this.setAccount(account);
		this.setSession(playKey1);
		this.LoginResult('OK');
		this.CharSelectionInfo();
	}
	LoginResult(success, reason) {
		switch(reason) {
			case 'SYSTEM_ERROR_LOGIN_LATER': reason = 1; break;
			case 'PASSWORD_DOES_NOT_MATCH_THIS_ACCOUNT': reason = 2; break;
			case 'PASSWORD_DOES_NOT_MATCH_THIS_ACCOUNT2': reason = 3; break;
			case 'ACCESS_FAILED_TRY_LATER': reason = 4; break;
			case 'INCORRECT_ACCOUNT_INFO_CONTACT_CUSTOMER_SUPPORT': reason = 5; break;
			case 'ACCESS_FAILED_TRY_LATER2': reason = 6; break;
			case 'ACOUNT_ALREADY_IN_USE': reason = 7; break;
			case 'ACCESS_FAILED_TRY_LATER3': reason = 8; break;
			case 'ACCESS_FAILED_TRY_LATER4': reason = 9; break;
			case 'ACCESS_FAILED_TRY_LATER5': reason = 10; break;
			default: 
				reason = 0; 
		}
		switch(success) {
			case 'OK': success = -1; break;
			default: 
				success = 0; 
		}
		let packet = new BaseSendablePacket(0x0A);
		packet.writeD(success);
		packet.writeD(reason);
		this.write(packet.buffer())
	}
	async CharSelectionInfo(){
		let characters = await L2Sql.query("SELECT * FROM characters WHERE account_name='" + this.getAccount() + "' ORDER BY createDate");
		let packet = new BaseSendablePacket(0x09);
		packet.writeD(characters.length);
		packet.writeD(config.max_characters_number); // Can prevent players from creating new characters (if 0); (if 1, the client will ask if chars may be created (0x13) Response: (0x0D) )
		packet.writeC(characters.length == config.max_characters_number ? 0x01 : 0x00); // if 1 can't create new char
		packet.writeC(0x01); // 0=can't play, 1=can play free until level 85, 2=100% free play
		packet.writeD(0x02); // if 1, Korean client
		packet.writeC(0x00); // Balthus Knights, if 1 suggests premium accou
		for (let i = 0; i < characters.length; i++) {
			let character = characters[i];
			packet.writeS(character.char_name); // Character name
			packet.writeD(character.charId); // Character ID
			packet.writeS(this.getAccount()); // Account name
			packet.writeD(this.getSession()); // Account ID
			packet.writeD(0x00); // Pledge ID
			packet.writeD(0x00); // Builder level
			packet.writeD(character.sex); // Sex
			packet.writeD(character.race); // Race
			packet.writeD(character.base_class);
			packet.writeD(0x01); // GameServerName
			packet.writeD(character.x);
			packet.writeD(character.y);
			packet.writeD(character.z);
			packet.writeF(character.curHp);
			packet.writeF(character.curMp);
			packet.writeQ(character.sp);
			packet.writeQ(character.exp);
			console.log(character.exp);
			console.log(experience.data[5]);
			packet.writeF((character.exp - experience.getExpForLevel(character.level))/(experience.getExpForLevel(character.level + 1) - experience.getExpForLevel(character.level))); // High// Five
			packet.writeD(character.level);
			packet.writeD(character.reputation);
			packet.writeD(character.pkkills);
			packet.writeD(character.pvpkills);
			packet.writeD(0x00);
			packet.writeD(0x00);
			packet.writeD(0x00);
			packet.writeD(0x00);
			packet.writeD(0x00);
			packet.writeD(0x00);
			packet.writeD(0x00);
			packet.writeD(0x00); // Ertheia
			packet.writeD(0x00); // Ertheia
			
			//let items = await L2Sql.query("SELECT loc, id, slot FROM items_ WHERE owner=" + character.charId);
			for (let i = 0; i < 42; ++i)
				packet.writeD(0x00);
			
			packet.writeH(0x00); // Upper Body enchant level
			packet.writeH(0x00); // Lower Body enchant level
			packet.writeH(0x00); // Headgear enchant level
			packet.writeH(0x00); // Gloves enchant level
			packet.writeH(0x00); // Boots enchant level
			packet.writeD(character.hairStyle);
			packet.writeD(character.hairColor);
			packet.writeD(character.face);
			packet.writeF(character.maxHp)
			packet.writeF(character.maxMp); 
			packet.writeD(character.deletetime > 0 ? ((character.deletetime - (Date.now() - config.character_delete_time * 60000)) / 1000) : 0);
			packet.writeD(character.classid);
			packet.writeD(i == this.getSlot() ? 1 : 0);
	
			packet.writeC(0);
			packet.writeD(0);
			packet.writeD(0);
			
			// packet.writeD(charInfoPackage.getTransformId()); // Used to display Transformations
			packet.writeD(0x00); // Currently on retail when you are on character select you don't see your transformation.
			
			packet.writeD(0x00); // Pet NpcId
			packet.writeD(0x00); // Pet level
			packet.writeD(0x00); // Pet Food
			packet.writeD(0x00); // Pet Food Level
			packet.writeF(0x00); // Current pet HP
			packet.writeF(0x00); // Current pet MP
			
			packet.writeD(character.vitality_points); // Vitality
			packet.writeD(config.rate_vitality_exp_multiplier * 100); // Vitality Percent
			packet.writeD(0); // Remaining vitality item uses
			packet.writeD(character.accsslevel == -100 ? 0x00 : 0x01);
			packet.writeC(character.nobless);
			packet.writeC(0); // Hero glow
			packet.writeC(0); // Show hair accessory if enabled
		}
		this.write(packet.buffer());
	}
	async CharacterSelect(packet) {
		let charSlot = packet.readD();
		let unk1 = packet.readH();
		let unk2 = packet.readD();
		let unk3 = packet.readD();
		let unk4 = packet.readD();
		if (charSlot < 0)
			return;
		let characters = await L2Sql.query("SELECT * FROM characters WHERE account_name='" + this.getAccount() + "' ORDER BY createDate");
		if (characters.length < charSlot)
			return;
		if (!characters[charSlot])
			return;
		this.setSlot(charSlot);
		this.position.source.x = this.position.current.x = parseInt(characters[charSlot].x);
		this.position.source.y = this.position.current.y = parseInt(characters[charSlot].y);
		this.position.source.z = this.position.current.z = parseInt(characters[charSlot].z);
		this.position.source.o = this.position.current.o = parseInt(characters[charSlot].heading);
		this.setName(characters[charSlot].char_name);
		this.setTitle("[title]" + this.getName());
		this.setClanId(characters[charSlot].clanid);
		this.setSex(characters[charSlot].sex);
		this.setRace(characters[charSlot].race);
		this.setCurrentHp(characters[charSlot].curHp);
		this.setCurrentMp(characters[charSlot].curMp);
		this.setClassId(characters[charSlot].classid);
		this.setMaxHp(characters[charSlot].maxHp);
		this.setMaxMp(characters[charSlot].maxMp);
		this.setLevel(characters[charSlot].level);
		this.setExp(characters[charSlot].exp);
		this.setSp(characters[charSlot].sp);
		this.setReputation(characters[charSlot].reputation);
		this.setPkKills(characters[charSlot].pkkills);
		this.CharacterSelected();
	}
	CharacterSelected() {
		let packet = new BaseSendablePacket(0x0B);
		packet.writeS(this.getName());
		packet.writeD(this.getGUID());
		packet.writeS(this.getTitle());
		packet.writeD(this.getSession());
		packet.writeD(this.getClanId());
		packet.writeD(0x00); // ??
		packet.writeD(this.getSex());
		packet.writeD(this.getRace());
		packet.writeD(this.getClassId());
		packet.writeD(0x01); // active ??
		packet.writeD(this.getX());
		packet.writeD(this.getY());
		packet.writeD(this.getZ());
		packet.writeF(this.getCurrentHp());
		packet.writeF(this.getCurrentMp());
		packet.writeQ(this.getSp());
		packet.writeQ(this.getExp());
		packet.writeD(this.getLevel());
		packet.writeD(this.getReputation());
		packet.writeD(this.getPkKills());
		packet.writeD((Date.now()/60000) % (24 * 60)); // "reset" on 24th hour
		packet.writeD(0x00);
	
		packet.writeD(this.getClassId());
		
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
		this.write(packet.buffer());
	}
	RequestGameStart(packet) {
		for (let i = 0; i < 20; i++)
			packet.readC();
		packet.readD(); // Unknown Value
		packet.readD(); // Unknown Value
		packet.readD(); // Unknown Value
		packet.readD(); // Unknown Value
		packet.readB(64); // Unknown Byte Array
		packet.readD(); // Unknown Value
		this.ExUserInfo();
	}
	ExUserInfo(...flags) {
		let size = 5;
		let mask = [0x00, 0x00, 0x00];
		if (flags.length > 0) {
		
		} else {
			mask = [0x78, 0x3C, 0x08];
			size += 16 + this.getName().length * 2 + 18 + 18 + 18 + 10 + 18+14 + 38 + 18;
		}
		let packet = new BaseSendablePacket(0x32);
		packet.writeD(this.getGUID());
		packet.writeD(size);
		packet.writeH(23);
		packet.writeB(mask);
		
		if ((mask[0] & 0x40) != 0){
			packet.writeH(16 + this.getName().length * 2);
			packet.writeT(this.getName());
			packet.writeC(this.isGM());
			packet.writeC(this.getRace());
			packet.writeC(this.getSex());
			packet.writeD(this.getClassId());
			packet.writeD(this.getClassId());
			packet.writeC(this.getLevel());
		}
		
		if ((mask[0] & 0x20) != 0){
			packet.writeH(18);
			packet.writeH(this.getSTR());
			packet.writeH(this.getDEX());
			packet.writeH(this.getCON());
			packet.writeH(this.getINT());
			packet.writeH(this.getWIT());
			packet.writeH(this.getMEN());
			packet.writeH(this.getLUC());
			packet.writeH(this.getCHA());
		}
		
		if ((mask[0] & 0x10) != 0){
			packet.writeH(14);
			packet.writeD(this.getMaxHp());
			packet.writeD(this.getMaxMp());
			packet.writeD(this.getMaxCp());
		}
		
		if ((mask[0] & 0x08) != 0){
			packet.writeH(38);
			packet.writeD(this.getCurrentHp());
			packet.writeD(this.getCurrentMp());
			packet.writeD(this.getCurrentCp());
			packet.writeQ(this.getSp());
			packet.writeQ(this.getExp());
			packet.writeF((this.getExp() - experience.getExpForLevel(this.getLevel()))/(experience.getExpForLevel(this.getLevel() + 1) - experience.getExpForLevel(this.getLevel())));
		}
		
		if ((mask[1] & 0x20) != 0) {
			packet.writeH(18);
			packet.writeD(this.getX());
			packet.writeD(this.getY());
			packet.writeD(this.getZ());
			packet.writeD(0);
		}
		if ((mask[1] & 0x10) != 0) {
			packet.writeH(18);
			packet.writeH(300);
			packet.writeH(300);
			packet.writeH(300);
			packet.writeH(300);
			packet.writeH(300);
			packet.writeH(300);
			packet.writeH(300);
			packet.writeH(300);
		}
		if ((mask[1] & 0x08) != 0) {
			packet.writeH(18);
			packet.writeF(1.0);
			packet.writeF(1.0);
		}
		if ((mask[1] & 0x04) != 0) {
			packet.writeH(18);
			packet.writeF(8.0);
			packet.writeF(23.5);
		}
		
		if ((mask[2] & 0x08) != 0) {
			packet.writeH(10);
			packet.writeD(0);
			packet.writeD(0);
		}
		this.write(packet.buffer());
		
		//[!] заплптка для добавления npc
		//let npc = new L2Npc();
		//L2World.add(npc);
		//this.write(npc.ExNpcInfo(this));
	}
}
module.exports = L2Session;