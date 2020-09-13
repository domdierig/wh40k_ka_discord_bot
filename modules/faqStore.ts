import writeJsonFile from 'write-json-file';
import loadJsonFile from 'load-json-file';
import { Faq } from './interfaces/faq.interface';

class FaqStore {
	private faq: Faq;

	constructor() {
		this.loadFaq();
	}

	public async getFaq(): Promise<Faq> {
		return this.faq;
	}

	public async getFaqMessage(key: string): Promise<string> {
		return this.faq[key.toLowerCase()];
	}

	public async searchMessageForFaqKey(message: string): Promise<string> {
		const lowerCaseMessage = message.toLowerCase();

		for (const key in this.faq) {
			if (
				lowerCaseMessage.includes(' ' + key + ' ') ||
				lowerCaseMessage.startsWith(key + ' ') ||
				lowerCaseMessage.endsWith(' ' + key) ||
				lowerCaseMessage === key ||
				lowerCaseMessage.endsWith(key + '?') ||
				lowerCaseMessage.endsWith(key + '??') ||
				lowerCaseMessage.endsWith(key + '?!')
			) {
				return this.faq[key];
			}
		}
	}

	public async setFaqMessage(key: string, message: string): Promise<void> {
		this.faq[key.toLowerCase()] = message;
		this.saveFaq();
	}

	public async deleteFaqMessage(key: string): Promise<void> {
		delete this.faq[key.toLowerCase()];
		this.saveFaq();
	}

	private async loadFaq(): Promise<void> {
		this.faq = await loadJsonFile('faq.json');
	}

	private async saveFaq(): Promise<void> {
		writeJsonFile('faq.json', this.faq);
	}
}

const faqStore = new FaqStore();

export default faqStore;
