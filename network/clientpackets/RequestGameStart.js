const L2Sql = require('../../database/L2Sql');
const CharacterSelected = require('../serverpackets/CharacterSelected');
class RequestGameStart {
	async run(client, packet) {
		let charSlot = packet.readD();
		let unk1 = packet.readH();
		let unk2 = packet.readD();
		let unk3 = packet.readD();
		let unk4 = packet.readD();
		if (charSlot < 0)
			return;
		let characters = await L2Sql.query("SELECT * FROM characters WHERE account_name='" + client.account + "' ORDER BY createDate");
		if (characters.length < charSlot)
			return;
		if (!characters[charSlot])
			return;
		client.slot = charSlot;
		client.guid = characters[client.slot].charId;
		client.name = characters[client.slot].char_name;
		client.title = client.name;
		client.level = characters[client.slot].level;
		client.maxHp = characters[client.slot].maxHp;
		client.curHp = characters[client.slot].curHp;
		client.maxCp = characters[client.slot].maxCp;
		client.curCp = characters[client.slot].curCp;
		client.maxMp = characters[client.slot].maxMp;
		client.curMp = characters[client.slot].curMp;
		client.face = characters[client.slot].face;
		client.hairStyle = characters[client.slot].hairStyle;
		client.hairColor = characters[client.slot].hairColor;
		client.sex = characters[client.slot].sex;
		client.heading = characters[client.slot].heading;
		client.x = characters[client.slot].x;
		client.y = characters[client.slot].y;
		client.z = characters[client.slot].z;
		client.exp = characters[client.slot].exp;
		client.expBeforeDeath = characters[client.slot].expBeforeDeath;
		client.sp = characters[client.slot].sp;
		client.reputation = characters[client.slot].reputation;
		client.fame = characters[client.slot].fame;
		client.raidbossPoints = characters[client.slot].raidbossPoints;
		client.pvpkills = characters[client.slot].pvpkills;
		client.pkkills = characters[client.slot].pkkills;
		client.clanid = characters[client.slot].clanid;
		client.race =  characters[client.slot].race;
		client.classid =  characters[client.slot].classid;
		client.base_class = characters[client.slot].base_class;
		client.transform_id = characters[client.slot].transform_id;
		client.deletetime = characters[client.slot].deletetime;
		client.cancraft =  characters[client.slot].cancraft;
		client.title = characters[client.slot].title;
		client.title_color = characters[client.slot].title_color;
		client.accesslevel = characters[client.slot].accesslevel;
		client.online = 1;//characters[client.slot].online;
		client.onlinetime = characters[client.slot].onlinetime;
		client.char_slot =  characters[client.slot].char_slot;
		client.lastAccess = characters[client.slot].lastAccess;
		client.clan_privs = characters[client.slot].clan_privs;
		client.wantspeace = characters[client.slot].wantspeace;
		client.power_grade =  characters[client.slot].power_grade;
		client.nobless = characters[client.slot].nobless;
		client.subpledge = characters[client.slot].subpledge;
		client.lvl_joined_academy = characters[client.slot].lvl_joined_academy;
		client.apprentice = characters[client.slot].apprentice;
		client.sponsor = characters[client.slot].sponsor;
		client.clan_join_expiry_time = characters[client.slot].clan_join_expiry_time;
		client.clan_create_expiry_time = characters[client.slot].clan_create_expiry_time;
		client.bookmarkslot = characters[client.slot].bookmarkslot;
		client.vitality_points = characters[client.slot].vitality_points;
		client.createDate = characters[client.slot].createDate;
		client.language = characters[client.slot].language;
		client.write(new CharacterSelected(client));
		return true;
	}
}
module.exports = RequestGameStart;