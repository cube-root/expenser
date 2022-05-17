import FirebaseService from "../helper/firebase";
import SheetService from "./sheets";
import api from '../api';

class TelegramService extends FirebaseService {
    firebase: FirebaseService
    apiSecret?: string
    chatId: string | string[]
    uid?: string
    email?: string

    constructor({
        API_SECRET,
        CHAT_ID,
        uid,
        email
    }: {
        API_SECRET?: string
        CHAT_ID: string | string[],
        uid?: string,
        email?: string
    }) {
        super();
        const firebase = new FirebaseService();
        this.firebase = firebase;
        this.apiSecret = API_SECRET;
        this.chatId = CHAT_ID;
        if (uid)
            this.uid = uid;
        if (email)
            this.email = email;
    }
    configure = async () => {
        if (!this.email || !this.uid) {
            await api.webhooks.sendMessage(this.chatId, 'Something went wrong!!');
            throw new Error('Invalid data');
        }

        // check if already configured
        try {
            const telegramData = await this.firebase.getTelegramChatId(this.chatId);
            console.log(telegramData);
            if(telegramData.uuid === this.uid){
                await api.webhooks.sendMessage(this.chatId, 'Already configured');
                return;
            }
        } catch (error) {
            // if error, then configure
        }

        const userData = await this.firebase.getUserByEmail(this.email);
        await this.firebase.setTelegramChatId(typeof this.chatId === 'string' ? this.chatId : `${this.chatId}`, {
            uid: this.uid,
            email: this.email,
            API_KEY: userData.API_KEY,
            API_SECRET: userData.API_SECRET,
        });
        // send success message to chat
        let message = 'Successfully configured Telegram integration \n\n';
        message += 'Now add the expense using /add command \n\n';
        await api.webhooks.sendMessage(this.chatId, message);
    }
    addExpense = async (data: { amount: string, remark: string, symbol: string, type: string }) => {
        const chatData = await this.firebase.getTelegramChatId(this.chatId);
        const { uuid, API_SECRET, API_KEY } = chatData;
        // sheet-id
        const sheetData = await this.firebase.getSheetData(uuid);
        const { spreadSheetId } = sheetData;
        const sheet = new SheetService({
            sheetId: spreadSheetId,
            API_KEY,
            API_SECRET,
        })
        await sheet.post(data);
    }
}

export default TelegramService