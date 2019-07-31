class RequestItemList {
	run(client, packet) {
		client.sendItemList(1);
	}
}
module.exports = RequestItemList;