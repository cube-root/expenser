/* eslint-disable consistent-return */
import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import api from './helper/api';
import { generateToken } from './helper/token';

export default class Bot {
  bot: TelegramBot;

  chatId: string | number | undefined;

  constructor(token: string) {
    this.bot = new TelegramBot(token, { polling: true });
  }

  start() {
    console.log('bot started....');
    this.bot.onText(/\/start/, async (msg: any) => {
      const chatId = msg.chat.id;
      this.chatId = chatId;
      await this.sendMessage(chatId, 'Please wait ...!!!');

      try {
        await api.getUser(this.chatId);
        this.bot.sendMessage(
          chatId,
          'Please click Home',
          {
            reply_markup: {
              keyboard: [[
                {
                  text: 'Home',
                  web_app: { url: `https://1589e78abc.to.intercept.rest/telegram/home?token=${generateToken({ chatId: this.chatId })}` },
                },
              ]],
            },
          },
        );
      } catch (error) {
        this.bot.sendMessage(
          chatId,
          'Please login',
          {
            reply_markup: {
              keyboard: [[
                {
                  text: 'Login',
                  web_app: { url: `https://1589e78abc.to.intercept.rest/telegram?chatId=${msg.chat.id}` },
                },
              ]],
            },
          },
        );
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
}
