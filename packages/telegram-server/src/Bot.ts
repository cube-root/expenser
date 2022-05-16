/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import api from './helper/api';

const message = `
Expense \n\n\n
1. Configure your API SECRET eg: /configure   \n
command: /configure API_SECRET
\n \n \n \n
2. Add Expense \n
command: /add \n
`;

export default class Bot {
  bot: TelegramBot;

  constructor(token: string) {
    this.bot = new TelegramBot(token, { polling: true });
  }

  start() {
    console.log('bot started....');
    this.bot.onText(/\/start/, (msg: any) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId, message);
    });
    this.bot.onText(/\/help/, (msg: any) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId, message);
    });
  }

  configure() {
    this.bot.onText(/\/configure/, async (msg: any) => {
      const apiPrompt = await this.bot.sendMessage(msg.chat.id, 'Hi, Please enter your API_SECRET HERE', {
        reply_markup: {
          force_reply: true,
        },
      });
      const chatId = msg.chat.id;
      this.bot.onReplyToMessage(chatId, apiPrompt.message_id, async (secret: any) => {
        const apiSecret = secret.text;
        if (!apiSecret || apiSecret.length === 0) {
          return this.bot.sendMessage(chatId, 'Please enter API_SECRET');
        }
        try {
          await this.bot.sendMessage(chatId, 'Configuring... Please wait');
          await api.configure(apiSecret, chatId);
          await this.bot.sendMessage(chatId, 'Configured successfully');
        } catch (error: any) {
          await this.bot.sendMessage(chatId, 'Something went wrong');
          if (error.response) { await this.bot.sendMessage(chatId, `${error.message}`); }
        }
      });
    });
  }

  async replyBot(chatId: number, question: string, callback?: any) {
    const prompt = await this.bot.sendMessage(chatId, question, {
      reply_markup: {
        force_reply: true,
      },
    });
    if (callback) {
      this.bot.onReplyToMessage(chatId, prompt.message_id, ((answer: any) => {
        if (callback) {
          callback(answer);
        }
      }));
    } else {
      return new Promise((resolve: any) => {
        this.bot.onReplyToMessage(chatId, prompt.message_id, ((answer: any) => {
          resolve(answer);
        }));
      });
    }
  }

  async keyboard(chatId: number, question: string, options: any) {
    await this.bot.sendMessage(chatId, question, {
      reply_markup: {
        force_reply: true,
        inline_keyboard: options,
      },
    });
    return new Promise((resolve: any) => {
      this.bot.on('callback_query', (msg: any) => {
        resolve(msg);
      });
    });
  }

  add() {
    this.bot.onText(/\/add/, async (msg: any) => {
      const amount: any = await this.replyBot(msg.chat.id, 'Enter Amount');
      const remark: any = await this.replyBot(msg.chat.id, 'Enter Remark');
      const type: any = await this.keyboard(
        msg.chat.id,
        'Enter type',
        [
          [{
            text: 'food',
            callback_data: 'food',

          }],
          [{
            text: 'travel',
            callback_data: 'travel',
          }],
          [{
            text: 'others',
            callback_data: 'others',

          }],
        ],
      );
      const currency: any = await this.keyboard(
        msg.chat.id,
        'Enter currency',
        [
          [{
            text: '$',
            callback_data: '$',

          }],
          [{
            text: '₹',
            callback_data: '₹',
          }],
          [{
            text: '€',
            callback_data: 'ot€hers',

          }],
        ],
      );
      await this.bot.sendMessage(msg.chat.id, 'Adding to sheet. Please wait...');
      try {
        await api.add({
          amount: amount.text,
          remark: remark.text,
          type: type.data,
          chatId: msg.chat.id,
          currency: currency.data,
        });
        await this.bot.sendMessage(msg.chat.id, 'Added successfully');
      } catch (error: any) {
        await this.bot.sendMessage(msg.chat.id, 'Something went wrong');
        if (error.response) { await this.bot.sendMessage(msg.chat.id, `${error.message} `); }
      }
    });
  }
}
