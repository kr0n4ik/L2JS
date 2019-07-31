class L2Packet {
	constructor() {
		this.write = 0;
		this.read = 0;
		this.data = new Uint8Array(255);
		this.view = new DataView(this.data.buffer);
    }
	setD(pos, val) {
		this.view.setInt32(pos, val, true);
	}
	writeD(val) {
		this.view.setInt32(this.write, val, true);
		this.write += 4;
	}
	readD() {
		let val = this.view.getInt32(this.read, true);
		this.read += 4;
		return val;
	}
	
	writeH(val) {
		this.view.setInt16(this.write, val, true);
		this.write += 2;
	}
	
	writeC(val) {
		this.view.setInt8(this.write, val);
		this.write += 1;
	}
	writeB(val, rev = false) {
		if (rev)
			for (let i = val.length - 1; i >= 0; --i)
				this.writeC(val[i]);
		else
			for (let i = 0; i < val.length; ++i)
				this.writeC(val[i]);
	}
	zero(n) {
		this.write += n;
	}
	test(val) {
		for (let i = 0; i < val.length/2; ++i)
			this.writeC(parseInt("0x"+val[i*2]+val[i*2+1]));
	}
}
module.exports = L2Packet;