const mysql = require('mysql');
const util = require('util');
class L2Sql {
	constructor() {
		this.db = mysql.createConnection({ host:'127.0.0.1', user:'lin', password:'123456', database:'l2j', insecureAuth: true});
		this.query = util.promisify(this.db.query).bind(this.db);
	}
}
module.exports = new L2Sql();