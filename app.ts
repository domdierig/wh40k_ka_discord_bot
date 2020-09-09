import dotenv from 'dotenv';
import Bot from './modules/bot';
import BotPageServer from './modules/botPageServer';

dotenv.config();

const botPageServer = new BotPageServer();
botPageServer.startServer();

if (process.env.NODE_ENV === 'prod') {
	const bot = new Bot();
	bot.init();
}
