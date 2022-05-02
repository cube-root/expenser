import 'dotenv/config'
import { Telegraf } from "telegraf";
import axios from 'axios';

const url = process.env.URL || 'http://localhost:3000';

const botToken = process.env.BOT_TOKEN || '';
const bot = new Telegraf(botToken);
const message = `
Expense \n\n\n
1. Configure your API key and secret eg: /configure ajknsd ajsdiw  \n
command: /configure API_KEY API_SECRET
\n \n \n \n
2. Add Expense \n
command: /add expense_amount remark \n
`
bot.start((ctx) => {
    ctx.reply(message, {
        parse_mode: 'HTML'
    })
})

bot.command('/configure', async (ctx) => {
    const x = ctx.message;
    let keys = x.text.split('/configure');
    keys = keys.filter(x => x !== '');
    const API_SECRET = keys[0];
    ctx.reply('Please wait while configuring')
    try {
        if (!API_SECRET) {
            ctx.reply('Please enter API_SECRET')
        }
        else {
            const response = await axios.post(`${url}/api/v1/integrations/telegram/configure`, {
                API_SECRET,
                CHAT_ID: ctx.chat.id
            })
            ctx.reply('Configured')
        }
    } catch (error) {
        console.log(error);
        ctx.reply('Something went wrong')
    }

})


bot.launch();