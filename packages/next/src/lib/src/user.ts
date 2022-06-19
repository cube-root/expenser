import axios from "axios";
import { verifyGoogleOathAccessToken, verifyKey } from '../helper/token';
import { generateToken, generateKey } from '../../helper'
import FirebaseService from "../helper/firebase";
import TelegramService from "./telegram";
class User {
    accessToken: any;
    telegramToken: any
    constructor(accessToken?: string, telegramToken?: string) {
        this.accessToken = accessToken;
        if (telegramToken) {
            this.telegramToken = telegramToken;
        }
    }
    // async verifyUser(){
    //     let publicKey = await axios.get('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
    //     publicKey = publicKey.data;
    //     const payload: any = verifyGoogleOathAccessToken(this.accessToken, publicKey);
    //     return payload;
    // }
    async registerUser() {
        let publicKey = await axios.get('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
        publicKey = publicKey.data;
        const payload: any = verifyGoogleOathAccessToken(this.accessToken, publicKey);
        const {
            email,
            name,
            picture,
            user_id: userId,
            email_verified: emailVerified,
        } = payload;
        const firebase = new FirebaseService();
        let API_KEY;
        let API_SECRET;
        try {
            const userResponse = await firebase.getUser(userId);
            API_KEY = userResponse.API_KEY;
            API_SECRET = userResponse.API_SECRET;

        } catch (error) {
            API_KEY = generateToken({
                uid: userId,
                email: email,
                name: name,
                picture: picture,
            });
            API_SECRET = generateKey();
        }
        firebase.setUser(userId, {
            name: name,
            email: email,
            photoUrl: picture,
            displayName: name,
            uid: userId,
            login_at: new Date(),
            API_KEY,
            API_SECRET,
            emailVerified
        })
        // set telegram chat id
        if (this.telegramToken) {
            const tokenData = await verifyKey(this.telegramToken, process.env.WEBHOOK_TOKEN);
            const { chatId } = tokenData;
            const telegram = new TelegramService({
                API_SECRET: API_SECRET,
                CHAT_ID: chatId,
                uid: userId,
                email: email,
            });
            await telegram.configure();
        }
        return {
            name: name,
            email: email,
            photoUrl: picture,
            displayName: name,
            uid: userId,
            API_KEY,
            API_SECRET,
        }
    }
    async getUserByTelegramChatId(chatId: string) {
        const firebase = new FirebaseService();
        return firebase.getTelegramChatId(chatId);
    }
    async getUserData(uuid: string) {
        const firebase = new FirebaseService();
        return firebase.getUser(uuid);
    }
}

export default User;