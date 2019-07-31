const L2Sql = require('../../database/L2Sql');
const config = require('../../config');
class CharSelectionInfo {
	constructor(account, session) {
		this.account = account;
		this.session = session;
	}
	async write(packet){
		let characters = await L2Sql.query("SELECT * FROM characters WHERE account_name='" + this.account + "' ORDER BY createDate");
		packet.writeC(0x09);
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
			packet.writeS(this.account); // Account name
			packet.writeD(this.session); // Account ID
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
			packet.writeF(0.4); // High// Five
			
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
			
			let items = await L2Sql.query("SELECT loc, id, slot FROM l2_items WHERE owner=" + character.charId);
			for (let i = 0; i < 42; ++i) {
				let id = 0x00;
				for (let item of items) {
					if ((item.loc == 1) && (item.slot == (1 << i))) {
						id = item.id;
						break;
					}
				}
				packet.writeD(id);
			}
			
			packet.writeH(0x00); // Upper Body enchant level
			packet.writeH(0x00); // Lower Body enchant level
			packet.writeH(0x00); // Headgear enchant level
			packet.writeH(0x00); // Gloves enchant level
			packet.writeH(0x00); // Boots enchant level
			
			packet.writeD(character.hairStyle);
			packet.writeD(character.hairColor);
			packet.writeD(character.face);
			
			packet.writeF(character.maxHp); // Maximum HP
			packet.writeF(character.maxMp); // Maximum MP
			
			packet.writeD(character.deletetime > 0 ? ((character.deletetime - (Date.now() - config.character_delete_time * 60000)) / 1000) : 0);
			packet.writeD(character.classid);
			packet.writeD(i == this.slot ? 1 : 0);
			
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
		return true;
	}
}
module.exports = CharSelectionInfo;