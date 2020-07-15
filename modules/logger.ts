import moment from 'moment';

export class Logger {
	constructor() {}

	log(message: string): void {
		console.log(this.getTime(), message);
	}

	logBotFAQ(message: string, key: string, phrase: string): void {
		console.log(
			this.getTime(),
			`${message}, key: ${key}, phrase: ${phrase}`
		);
	}

	logUliChance(rolled: number, upperBoundary: number): void {
		console.log(
			this.getTime(),
			`random number was ${rolled}, upper boundary is ${upperBoundary}`
		);
	}

	getTime(): string {
		return moment().format('DD.MM.YYYY - HH:mm :');
	}
}

const logger = new Logger();

export default logger;
