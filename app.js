const dotenv = require('dotenv');

const Bot = require('./modules/bot.js');
const logger = require('./modules/logger.js');

dotenv.config();

const bot = new Bot(logger);
bot.init();
