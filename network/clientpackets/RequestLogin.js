const LoginFail = require('../serverpackets/LoginFail');
const CharSelectionInfo = require('../serverpackets/CharSelectionInfo');
class RequestLogin {
	run(client, packet) {
		/*Тут просиходит обмен с логином и проверка ланныйх */
		let account = packet.readS().toLowerCase();
		let playKey2 = packet.readD();
		let playKey1 = packet.readD();
		let loginKey1 = packet.readD();
		let loginKey2 = packet.readD();
		if (account.length < 1 || !client.key) {
			client.socket.end();
			return;
		}
		console.log(playKey2.toString(16) + " " + playKey1.toString(16) + " " + loginKey1.toString(16) + " " + loginKey2.toString(16));
		client.account = account;
		client.session = playKey1;
		client.write(new LoginFail('OK'));
		client.write(new CharSelectionInfo(client.account, client.session));
	}
}
module.exports = RequestLogin;