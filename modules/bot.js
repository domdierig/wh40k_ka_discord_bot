const Discord = require('discord.js');
const writeJsonFile = require('write-json-file');
const loadJsonFile = require('load-json-file');

const prefix = '!';
const addCommand = prefix + 'add';
const deleteCommand = prefix + 'delete';

class Bot {
	constructor() {
		this.discordBot = new Discord.Client();
		this.faq = {};

		this.init();
	}

	async saveFAQ() {
		await writeJsonFile('faq.json', this.faq);
	}

	async init() {
		this.discordBot.login(process.env.BOT_TOKEN);

		this.faq = await loadJsonFile('faq.json');

		this.registerReady();
		this.registerBotMention();
		this.registerAddFaqCommand();
		this.registerDeleteFaqCommand();
		this.registerSendFaqAnswer();
	}

	async registerReady() {
		this.discordBot.on('ready', async () => {
			console.log('bot online');
		});
	}

	async registerBotMention() {
		this.discordBot.on('message', async (message) => {
			if (message.author.bot) {
				return;
			}
			if (message.content.includes(this.discordBot.user.id)) {
				console.log('mention registred');
				return await message.channel.send('Ich lebe um zu dienen...');
			}
		});
	}

	async registerAddFaqCommand() {
		this.discordBot.on('message', async (message) => {
			if (message.author.bot) {
				return;
			}

			if (!message.content.startsWith(addCommand)) {
				return;
			}

			if (
				!message.channel
					.permissionsFor(message.member)
					.has('ADMINISTRATOR')
			) {
				return await message.channel.send(
					'Du verfügst nicht über die nötigen Zugangsrechte um dieses Kommando auszuführen.'
				);
			}

			const content = message.content
				.substring(addCommand.length + 1)
				.split(' - ');

			if (content.length < 2) {
				return await message.channel.send(
					'Argumentliste unvollständig. Erbete erneute Eingabe.'
				);
			}

			this.faq[content[0].toLowerCase()] = content[1];

			await writeJsonFile('faq.json', this.faq);

			console.log('new faq message, key: ', content[0]);
			return await message.channel.send('Kommando ausgeführt.');
		});
	}

	async registerDeleteFaqCommand() {
		this.discordBot.on('message', async (message) => {
			if (message.author.bot) {
				return;
			}

			if (!message.content.startsWith(deleteCommand)) {
				return;
			}

			if (
				!message.channel
					.permissionsFor(message.member)
					.has('ADMINISTRATOR')
			) {
				return await message.channel.send(
					'Du verfügst nicht über die nötigen Zugangsrechte um dieses Kommando auszuführen.'
				);
			}

			const content = message.content.substring(deleteCommand.length + 1);

			delete this.faq[content.toLowerCase()];

			await writeJsonFile('faq.json', this.faq);

			return await message.channel.send('Kommando ausgeführt.');
		});
	}

	async registerSendFaqAnswer() {
		this.discordBot.on('message', async (message) => {
			if (message.author.bot) {
				return;
			}

			if (message.content.startsWith(prefix)) {
				return;
			}

			const content = message.content.toLowerCase();

			for (const key in this.faq) {
				if (content.includes(key)) {
					await message.channel.send(this.faq[key]);
					console.log('faq message send, key: ', key);
					break;
				}
			}
		});
	}
}

module.exports = Bot;
