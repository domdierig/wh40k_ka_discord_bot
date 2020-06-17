const dotenv = require('dotenv');

const Bot = require('./modules/bot.js');

dotenv.config();

const bot = new Bot();
