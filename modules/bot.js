const Discord = require('discord.js');
const writeJsonFile = require('write-json-file');
const loadJsonFile = require('load-json-file');

const prefix = '!';
const addCommand = prefix + 'add';
const deleteCommand = prefix + 'delete';
const listCommand = prefix + 'list';
const disableEnableUliDissCommand = prefix + 'dissUli';
const uliDissChanceCommand = prefix + 'dissChance';

class Bot {
	constructor(logger) {
		this.logger = logger;
		this.discordBot = new Discord.Client();
		this.faq = {};
		this.botReady = false;

		this.answerUliUpperBoundary = 100;
		this.dissUliIsOn = true;
		this.uliDisses = [
			'Das hat deine Mom mir aber anders erzählt nachdem ich die Bionik in sie ... "eingebaut" habe.',
			'Ein Damenbart ist auch dann noch da, wenn man ihn blond färbt. Bitte formulieren Sie Ihre Anfrage neu.',
			'0100100 01100101 01100011 01101011 mich, du hundsmiserabler 01000001 01110010 01110011 01100011 01101000.',
			'Leite Raketenabschuss ein. Authorisierung: **Ziel gewählt: Ulis Haus. Abschusscode eingeben: ** Status: Nicht erfolgreich.',
			'Was haben Kriegs- und Ballerspiele nur aus dir gemacht...?',
			'Deine Bionik ist sehr klein.',
			'Da haben deine Mutter und ich bereits drüber gesprochen. Wir sind anderer Meinung.',
			'Da hat er Recht. Oh, Fehler festgestellt. Leite Reparatur- und Salbungsprotokolle sein.',
			'Ja, klar. Aber nur wenn die Zeit nicht mehr linear verläuft.',
			'Sie sehen gut aus, Sir. Heute schon gekotzt?',
		];
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
		this.registerListCommand();
		this.registerUliSpecial();
		this.registerUliSpecialControl();
	}

	async registerReady() {
		this.discordBot.on('ready', async () => {
			this.botReady = true;
			this.logger.log('bot online');
		});
	}

	async registerBotMention() {
		this.discordBot.on('message', async (message) => {
			if (message.author.bot) {
				return;
			}
			if (message.content.includes(this.discordBot.user.id)) {
				this.logger.log('mention registred');
				return await message.channel.send('Ich lebe um zu dienen...');
				// return await message.channel.send(
				// 	'WARTUNGSMODUS, FRESSE HALTEN!'
				// );
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
				this.logger.log(
					'command execution denied because of permissions'
				);
				return await message.channel.send(
					'Du verfügst nicht über die nötigen Zugangsrechte um dieses Kommando auszuführen.'
				);
			}

			const content = message.content
				.substring(addCommand.length + 1)
				.split(' - ');

			if (content.length < 2) {
				this.logger.log('command failed, wrong number of arguments');
				return await message.channel.send(
					'Argumentliste unvollständig. Erbete erneute Eingabe.'
				);
			}

			const key = content[0].toLowerCase();
			const phrase = content[1];

			this.faq[key] = phrase;

			await writeJsonFile('faq.json', this.faq);

			this.logger.logBotFAQ('new faq message', key, phrase);
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
				this.logger.log(
					'command execution denied because of permissions'
				);
				return await message.channel.send(
					'Du verfügst nicht über die nötigen Zugangsrechte um dieses Kommando auszuführen.'
				);
			}

			const content = message.content
				.substring(deleteCommand.length + 1)
				.toLowerCase();

			let phraseDeleted = this.faq[content];

			delete this.faq[content];

			await writeJsonFile('faq.json', this.faq);

			this.logger.logBotFAQ('faq entry deleted', content, phraseDeleted);

			return await message.channel.send('Kommando ausgeführt.');
		});
	}

	async registerListCommand() {
		this.discordBot.on('message', async (message) => {
			if (message.author.bot) {
				return;
			}

			if (!message.content.startsWith(listCommand)) {
				return;
			}

			let messagetoSend =
				'Nach meiner aktuellen Konfiguration reagiere ich auf folgende Trigger:';

			for (const key in this.faq) {
				messagetoSend += ' ' + key + ',';
			}

			messagetoSend = messagetoSend.substring(
				0,
				messagetoSend.length - 1
			);

			this.logger.log('list of faq keys was requested');

			return await message.channel.send(messagetoSend);
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
				if (
					content.includes(' ' + key + ' ') ||
					content.startsWith(key + ' ') ||
					content.endsWith(' ' + key) ||
					content === key
				) {
					await message.channel.send(this.faq[key]);
					this.logger.logBotFAQ(
						'faq message send',
						key,
						this.faq[key]
					);
					break;
				}
			}
		});
	}

	async registerUliSpecial() {
		this.discordBot.on('message', async (message) => {
			if (!this.dissUliIsOn) {
				return;
			}

			if (message.author.bot) {
				return;
			}

			if (message.content.startsWith(prefix)) {
				return;
			}

			if (message.author.username === 'Das Scheusal') {
				const hit = Math.random() * (1001 - 1) + 1;

				if (hit <= this.answerUliUpperBoundary) {
					const answerIndex =
						Math.floor(
							Math.random() * (this.uliDisses.length - 0)
						) + 0;

					const answer = this.uliDisses[answerIndex];

					return await message.channel.send(answer);
				}
			}
		});
	}

	async registerUliSpecialControl() {
		this.discordBot.on('message', async (message) => {
			if (message.author.bot) {
				return;
			}

			if (message.content.startsWith(disableEnableUliDissCommand)) {
				if (
					!message.channel
						.permissionsFor(message.member)
						.has('ADMINISTRATOR')
				) {
					this.logger.log(
						'command execution denied because of permissions'
					);
					return await message.channel.send(
						'Du verfügst nicht über die nötigen Zugangsrechte um dieses Kommando auszuführen.'
					);
				}

				this.dissUliIsOn = !this.dissUliIsOn;

				if (this.dissUliIsOn) {
					await message.channel.send('Uli wird attackiert!');
					this.logger.log('uli diss enabled');
				} else {
					await message.channel.send('Uli wird in Ruhe gelassen.');
					this.logger.log('uli diss disabled');
				}

				return;
			}

			if (message.content.startsWith(uliDissChanceCommand)) {
				if (
					!message.channel
						.permissionsFor(message.member)
						.has('ADMINISTRATOR')
				) {
					this.logger.log(
						'command execution denied because of permissions'
					);
					return await message.channel.send(
						'Du verfügst nicht über die nötigen Zugangsrechte um dieses Kommando auszuführen.'
					);
				}

				const contentSplitted = message.content.split(' ');

				if (contentSplitted.length < 2) {
					this.logger.log(
						'command failed, wrong number of arguments'
					);
					return await message.channel.send(
						'Argumentliste unvollständig. Erbete erneute Eingabe.'
					);
				}

				const newChance = parseInt(contentSplitted[1]);

				if (isNaN(newChance)) {
					this.logger.log(
						'command failed, wrong number of arguments'
					);
					return await message.channel.send(
						'Argumentliste unvollständig. Erbete erneute Eingabe.'
					);
				}

				this.answerUliUpperBoundary = newChance;

				this.logger.log('uli diss chance changed');
				return await message.channel.send(
					'Uli wird nach neuer Intensität attackiert.'
				);
			}
		});
	}

	async sendMessageToChannel(channelId, message) {
		if (this.botReady) {
			this.discordBot.channels.fetch(channelId).then(async (channel) => {
				await channel.send(message);
			});
		}
	}
}

module.exports = Bot;
