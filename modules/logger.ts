import dayjs from 'dayjs';

export class Logger {
	constructor() {}

	log(message: string): void {
		console.log(this.getTime(), message);
	}

	logBotFAQ(message: string, key: string, phrase: string): void {
		console.log(this.getTime(), `${message}, key: ${key}, phrase: ${phrase}`);
	}

	getTime(): string {
		return dayjs().format('DD.MM.YYYY - HH:mm :');
	}
}

const logger = new Logger();

export default logger;
