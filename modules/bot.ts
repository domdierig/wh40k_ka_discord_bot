import Discord from 'discord.js';
import logger from './logger';
import faqStore from './faqStore';

const prefix = '!';
const addCommand = prefix + 'add';
const deleteCommand = prefix + 'delete';

export default class Bot {
	discordBot: Discord.Client;
	botReady: boolean;

	constructor() {
		this.discordBot = new Discord.Client();
		this.botReady = false;
	}

	async init(): Promise<void> {
		this.discordBot.login(process.env.BOT_TOKEN);

		this.registerReady();
		this.registerBotMention();
		this.registerAddFaqCommand();
		this.registerDeleteFaqCommand();
		this.registerSendFaqAnswer();
	}

	async registerReady(): Promise<void> {
		this.discordBot.on('ready', async () => {
			this.botReady = true;
			logger.log('bot online');
		});
	}

	async registerBotMention(): Promise<void> {
		this.discordBot.on('message', async (message) => {
			if (message.author.bot) {
				return;
			}
			if (message.content.includes(this.discordBot.user.id)) {
				logger.log('mention registred');
				if (process.env.NODE_ENV === 'prod') {
					return await message.channel.send('Ich lebe um zu dienen...');
				}
				if (process.env.NODE_ENV === 'dev') {
					return await message.channel.send('WARTUNGSMODUS, FRESSE HALTEN!');
				}
			}
		});
	}

	async registerAddFaqCommand(): Promise<void> {
		this.discordBot.on('message', async (message) => {
			if (message.author.bot) {
				return;
			}

			if (!message.content.startsWith(addCommand)) {
				return;
			}

			if (!message.member.hasPermission('ADMINISTRATOR')) {
				logger.log('command execution denied because of permissions');
				return await message.channel.send('Du verfügst nicht über die nötigen Zugangsrechte um dieses Kommando auszuführen.');
			}

			const content = message.content.substring(addCommand.length + 1).split(' - ');

			if (content.length < 2) {
				logger.log('command failed, wrong number of arguments');
				return await message.channel.send('Argumentliste unvollständig. Erbete erneute Eingabe.');
			}

			const key = content[0].toLowerCase();
			const phrase = content[1];

			faqStore.setFaqMessage(key, phrase);

			logger.logBotFAQ('new faq message', key, phrase);
			return await message.channel.send('Kommando ausgeführt.');
		});
	}

	async registerDeleteFaqCommand(): Promise<void> {
		this.discordBot.on('message', async (message) => {
			if (message.author.bot) {
				return;
			}

			if (!message.content.startsWith(deleteCommand)) {
				return;
			}

			if (!message.member.hasPermission('ADMINISTRATOR')) {
				logger.log('command execution denied because of permissions');
				return await message.channel.send('Du verfügst nicht über die nötigen Zugangsrechte um dieses Kommando auszuführen.');
			}

			const content = message.content.substring(deleteCommand.length + 1).toLowerCase();

			let phraseDeleted = await faqStore.getFaqMessage(content);
			faqStore.deleteFaqMessage(content);

			logger.logBotFAQ('faq entry deleted', content, phraseDeleted);

			return await message.channel.send('Kommando ausgeführt.');
		});
	}

	async registerSendFaqAnswer(): Promise<void> {
		this.discordBot.on('message', async (message) => {
			if (message.author.bot) {
				return;
			}

			const channelId: string = message.channel.id;
			//724548288295993424 channel off-topic
			//724558659086057532 channel everything-warhammer
			//719556531787399169 channel adminchannel
			if (channelId !== '724548288295993424' && channelId !== '724558659086057532' && channelId !== '719556531787399169') {
				return;
			}

			if (message.content.startsWith(prefix)) {
				return;
			}

			const faq = await faqStore.searchMessageForFaqKey(message.content);
			if (faq) {
				message.channel.send(faq);
				logger.log('faq message send');
			}
		});
	}
}
