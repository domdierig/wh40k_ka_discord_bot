import moment from 'moment';

export class Logger {
	constructor() {}

	log(message: string): void {
		console.log(this.getTime(), message);
	}

	logBotFAQ(message: string, key: string, phrase: string): void {
		console.log(this.getTime(), `${message}, key: ${key}, phrase: ${phrase}`);
	}

	getTime(): string {
		return moment().format('DD.MM.YYYY - HH:mm :');
	}
}

const logger = new Logger();

export default logger;
