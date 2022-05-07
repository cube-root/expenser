import * as firestore from "firebase/firestore/lite";
import * as firebase from 'firebase/app';
import tags from '../../config/tag.json';


class FirebaseService {
    app: any;
    db: any
    constructor() {
        let app;
        const firebaseConfig: any = {
            FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || undefined,
            FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || undefined,
            PROJECT_ID: process.env.PROJECT_ID || undefined,
            STORAGE_BUCKET: process.env.STORAGE_BUCKET || undefined,
            MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID || undefined,
            APP_ID: process.env.APP_ID || undefined
        }
        try {
            const firebaseApps = firebase.getApp(tags.firebaseTag);
            app = firebaseApps;
        } catch (error) {
            app = firebase.initializeApp({ ...firebaseConfig, projectId: process.env.PROJECT_ID }, tags.firebaseTag);
        }

        this.app = app;
        this.db = firestore.getFirestore(this.app);
    }
    getUser = async (uuid: string) => {
        const userDocRef = firestore.doc(this.db, tags.userCollectionTag, uuid);
        const userDocSnapShot = await firestore.getDoc(userDocRef);
        if (!userDocSnapShot.exists()) {
            throw new Error('User not found');
        }
        return userDocSnapShot.data();
    }

    getUserByEmail = async (email: string) => {
        const collection: any = firestore.collection(this.db, tags.userCollectionTag);
        const query = firestore.query(collection, firestore.where('email', '==', email));
        const userDocSnapShot = await firestore.getDocs(query);
        let result: any = userDocSnapShot.docs.map(doc => doc.data())
        if (result.length === 0) {
            throw new Error('User not found');
        } else {
            result = result.find((data: any) => data.email === email)
            return {
                API_KEY: result.API_KEY,
                API_SECRET: result.API_SECRET
            }
        }
    }
    getUserBySecret = async (secret?: string) => {
        const collection: any = firestore.collection(this.db, tags.userCollectionTag);
        const query = firestore.query(collection, firestore.where('API_SECRET', '==', secret?.trim()));
        const userDocSnapShot = await firestore.getDocs(query);
        let result: any = userDocSnapShot.docs.map(doc => doc.data())
        if (result.length === 0) {
            throw new Error('User not found');
        } else {
            result = result.find((data: any) => data.API_SECRET === secret?.trim())
            return {
                uid: result.uid,
                email: result.email,
                API_KEY: result.API_KEY,
                API_SECRET: result.API_SECRET
            }
        }
    }
    setTelegramChatId = async (chatId: string, data: {
        uid: string,
        email: string,
        API_KEY: string,
        API_SECRET: string
    }) => {
        const updateRef = firestore.doc(
            this.db,
            tags.telegramCollectionTag,
            chatId,
        );
        await firestore.setDoc(updateRef, {
            uuid: data.uid,
            email: data.email,
            API_KEY: data.API_KEY,
            API_SECRET: data.API_SECRET,
        });
    }
    getTelegramChatId = async (chatId:string) => {
        const chatDocRef = firestore.doc(this.db, tags.telegramCollectionTag, chatId);
        const chatSnapShot = await firestore.getDoc(chatDocRef);
        if (!chatSnapShot.exists()) {
            throw new Error('Telegram Chat not found');
        }
        return chatSnapShot.data();
    }
    getSheetData = async(uid:string)=>{
        const sheetDataRef = firestore.doc(this.db, tags.sheetCollectionTag, uid);
        const sheetDataSnapShot = await firestore.getDoc(sheetDataRef);
        if (!sheetDataSnapShot.exists()) {
            throw new Error('Sheet data not found');
        }
        return sheetDataSnapShot.data();
    }
}

export default FirebaseService;