const moment = require('moment');

class Logger {
	constructor() {}

	log(message) {
		console.log(this.getTime(), message);
	}

	logBotFAQ(message, key, phrase) {
		console.log(
			this.getTime(),
			`${message}, key: ${key}, phrase :${phrase}`
		);
	}

	getTime() {
		return moment().format('DD. MM. YYYY, hh:mm:ss:');
	}
}

const logger = new Logger();

module.exports = logger;
