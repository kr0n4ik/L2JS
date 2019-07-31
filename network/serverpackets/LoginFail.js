class LoginFail {
	constructor(success, reason) {
		switch(reason) {
			case 'SYSTEM_ERROR_LOGIN_LATER': this.reason = 1; break;
			case 'PASSWORD_DOES_NOT_MATCH_THIS_ACCOUNT': this.reason = 2; break;
			case 'PASSWORD_DOES_NOT_MATCH_THIS_ACCOUNT2': this.reason = 3; break;
			case 'ACCESS_FAILED_TRY_LATER': this.reason = 4; break;
			case 'INCORRECT_ACCOUNT_INFO_CONTACT_CUSTOMER_SUPPORT': this.reason = 5; break;
			case 'ACCESS_FAILED_TRY_LATER2': this.reason = 6; break;
			case 'ACOUNT_ALREADY_IN_USE': this.reason = 7; break;
			case 'ACCESS_FAILED_TRY_LATER3': this.reason = 8; break;
			case 'ACCESS_FAILED_TRY_LATER4': this.reason = 9; break;
			case 'ACCESS_FAILED_TRY_LATER5': this.reason = 10; break;
			default: 
				this.reason = 0; 
		}
		switch(success) {
			case 'OK': this.success = -1; break;
			default: 
				this.success = 0; 
		}
	}
	write(packet){
		packet.writeC(0x0A);
		packet.writeD(this.success);
		packet.writeD(this.reason);
		return true;
	}
}
module.exports = LoginFail;