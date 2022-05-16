import FirebaseService from "../helper/firebase";
import SheetService from "./sheets";
import axios from "axios";
class TelegramService extends FirebaseService {
    firebase: FirebaseService
    apiSecret?: string
    chatId: string | string[]

    constructor({
        API_SECRET,
        CHAT_ID,
    }: {
        API_SECRET?: string
        CHAT_ID: string | string[]
    }) {
        super();
        const firebase = new FirebaseService();
        this.firebase = firebase;
        this.apiSecret = API_SECRET;
        this.chatId = CHAT_ID;
    }
    configure = async () => {
        const userData = await this.firebase.getUserBySecret(this.apiSecret);
        await this.firebase.setTelegramChatId(typeof this.chatId === 'string' ? this.chatId : `${this.chatId}`, {
            uid: userData.uid,
            email: userData.email,
            API_KEY: userData.API_KEY,
            API_SECRET: userData.API_SECRET,
        });
        // send success message to chat
        try {
            await axios.get(`${process.env.WEBHOOK_URL}/api/v1/webhooks/send-message?chatId=${this.chatId}&text='Configuration Success'`);
        } catch (error) {
           // do nothing     
        }
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