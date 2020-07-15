import dotenv from 'dotenv';
import Bot from './modules/bot';
import logger from './modules/logger';

// const dotenv = require('dotenv');

// const Bot = require('./modules/bot.js');
// const logger = require('./modules/logger.js');

dotenv.config();

const bot = new Bot(logger);
bot.init();
