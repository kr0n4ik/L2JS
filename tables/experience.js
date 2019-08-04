const util = require('util');
const parser = require('xml2js').parseString;
const fs = require('fs');
class experience {
	constructor() {
		this.parser = util.promisify(parser);
		this.data = [];
		this.load();
	}
	async load() {
		let ms = Date.now();
		let data = fs.readFileSync("data/stats/experience.xml");
		let result = await this.parser(data);
		for (let val of result.table.experience)
			this.data[parseInt(val.$.level)] = {'exp': parseInt(val.$.tolevel), 'rate': parseFloat(val.$.trainingRate)};
		console.log(">>".green + " load experience " + this.data.length + " " + (Date.now() - ms) + " ms");
	}
	getExpForLevel(level) {
		return this.data[level].exp;
	}
}
module.exports = new experience();