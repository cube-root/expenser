/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import api from './helper/api';

const botToken = process.env.BOT_TOKEN || '';
const message = `
Expense \n\n\n
1. Configure your API key and secret eg: /configure ajknsd ajsdiw  \n
command: /configure API_KEY API_SECRET
\n \n \n \n
2. Add Expense \n
command: /add --amount=250 --type=food --currency=$ --remark=test\n
`;

class Bot {
  bot: TelegramBot;

  constructor(token: string) {
    this.bot = new TelegramBot(token, { polling: true });
  }

  start() {
    console.log('bot started....');
    this.bot.on('new_chat_members', (msg:any) => {
      this.bot.sendMessage(msg.chat.id, message);
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

  add() {
    this.bot.onText(/\/add/, async (msg: any) => {
      const amount: any = await this.replyBot(msg.chat.id, 'Enter Amount');
      const remark: any = await this.replyBot(msg.chat.id, 'Enter Remark');
      const type: any = await this.replyBot(msg.chat.id, 'Enter type (eg:food, travel, etc)');
      await this.bot.sendMessage(msg.chat.id, 'Adding to sheet. Please wait...');
      try {
        await api.add({
          amount: amount.text,
          remark: remark.text,
          type: type.text,
          chatId: msg.chat.id,
        });
        await this.bot.sendMessage(msg.chat.id, 'Added successfully');
      } catch (error: any) {
        await this.bot.sendMessage(msg.chat.id, 'Something went wrong');
        if (error.response) { await this.bot.sendMessage(msg.chat.id, `${error.message}`); }
      }
    });
  }
}

const bot = new Bot(botToken);
bot.start();
bot.configure();
bot.add();
