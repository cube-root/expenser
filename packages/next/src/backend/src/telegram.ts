import FirebaseService from "../helper/firebase";

class TelegramService extends FirebaseService {
    firebase:FirebaseService
    apiSecret?: string
    chatId: string

    constructor({
        API_SECRET,
        CHAT_ID,
    }:{
        API_SECRET?: string
        CHAT_ID: string
    }) {
        super();
        const firebase = new FirebaseService();
        this.firebase = firebase;
        this.apiSecret = API_SECRET;
        this.chatId = CHAT_ID;
    }
    configure = async()=>{
        const userData = await this.firebase.getUserBySecret(this.apiSecret);
        await this.firebase.setTelegramChatId(typeof this.chatId === 'string' ? this.chatId : `${this.chatId}`, {
            uid: userData.uid,
            email: userData.email,
            API_KEY: userData.API_KEY,
            API_SECRET: userData.API_SECRET,
        });
    }
}

export default TelegramService