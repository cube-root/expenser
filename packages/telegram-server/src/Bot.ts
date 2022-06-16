/* eslint-disable consistent-return */
import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import api from './helper/api';
import extract from './helper/extract-sheet-id';

const message = `
Expense \n\n\n
1. Configure with dashboard eg: /configure   \n
command: /configure 
\n \n \n \n
2. Add Expense \n
command: /add \n
\n\n\n\n
3. Change sheet\n
command: /change
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
      this.bot.sendMessage(
        msg.chat.id,
        'Please login',
        {
          reply_markup: {
            keyboard: [[
              {
                text: 'Login',
                web_app: { url: `https://1589e78abc.to.intercept.rest/telegram-login?chatId=${msg.chat.id}` },
              },
            ]],
          },
        },
      );
      this.bot.sendMessage(chatId, message);
    });
    this.bot.onText(/\/help/, (msg: any) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId, message);
    });
  }

  configure() {
    this.bot.onText(/\/configure/, async (msg: any) => {
      const chatId = msg.chat.id;
      const customUrl = `${process.env.URL}/telegram-login?chatId=${chatId}`;
      await this.bot.sendMessage(chatId, 'Click to login', {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [[{ text: 'Login', url: customUrl }]],
        },
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

  async sendMessage(chatId: number | string | any, text: string | any) {
    try {
      await this.bot.sendMessage(chatId, text);
    } catch (error) {
      // do nothing
    }
  }

  async changeSheet() {
    this.bot.onText(/\/change/, async (msg: any) => {
      const chatId = msg.chat.id;
      await this.bot.sendMessage(chatId, `Share the email with your sheet (${process.env.CLIENT_EMAIL})`);
      const sheet: any = await this.replyBot(chatId, 'Enter Sheet link');
      try {
        await this.bot.sendMessage(chatId, 'Changing sheet. Please wait...');
        const sheetId = extract.extractSheet(sheet.text);
        await api.changeSheet(sheetId, sheet.text, chatId);
        await this.bot.sendMessage(chatId, 'Sheet changed successfully');
      } catch (error: any) {
        await this.bot.sendMessage(chatId, 'Something went wrong');
        if (error.response) { await this.bot.sendMessage(chatId, `${error.message} `); }
      }
    });
  }
}
