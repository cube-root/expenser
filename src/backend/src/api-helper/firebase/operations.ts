import * as firestore from "firebase/firestore/lite";
import * as firebase from 'firebase/app';
import { firebaseTag, firestoreUserCollectionTag } from '../../../../config/tag';
const getApp = () => {
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
        const firebaseApps = firebase.getApp(firebaseTag);
        app = firebaseApps;
    } catch (error) {
        app = firebase.initializeApp({ ...firebaseConfig, projectId: process.env.PROJECT_ID }, firebaseTag);
    }

    return app;

}

const getDB = (app: any) => {
    return firestore.getFirestore(app);
}

const getUser = async (db: any, uuid: any) => {
    const userDocRef = firestore.doc(db, firestoreUserCollectionTag, uuid);
    const userDocSnapShot = await firestore.getDoc(userDocRef);
    if (!userDocSnapShot.exists()) {
        throw new Error('User not found');
    }
    return userDocSnapShot.data();

}
export {
    getApp,
    getDB,
    getUser
}