const moment = require('moment');

class Logger {
	constructor() {}

	log(message) {
		console.log(this.getTime(), message);
	}

	logBotFAQ(message, key, phrase) {
		console.log(
			this.getTime(),
			`${message}, key: ${key}, phrase: ${phrase}`
		);
	}

	logUliChance(rolled, upperBoundary) {
		console.log(
			this.getTime(),
			`random number was ${rolled}, upper boundary is ${upperBoundary}`
		);
	}

	getTime() {
		return moment().format('DD.MM.YYYY - HH:mm :');
	}
}

const logger = new Logger();

module.exports = logger;
