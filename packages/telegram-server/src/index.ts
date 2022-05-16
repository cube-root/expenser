/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import express from 'express';
import cors from 'cors';
import Bot from './Bot';

const botToken = process.env.BOT_TOKEN || '';
const app = express();
const port = process.env.PORT || 3001;
app.use(cors());

const bot = new Bot(botToken);
bot.start();
bot.configure();
bot.add();

app.get('/', (req:any, res:any) => res.status(200).json({ message: 'hello' }));
app.listen(port, () => {
  console.log('server started at port', port);
});
