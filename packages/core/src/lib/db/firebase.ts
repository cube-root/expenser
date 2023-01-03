import * as firebase from 'firebase/app';
import * as firestore from 'firebase/firestore/lite';
import { getFirebaseConfig } from '../../utils';
import { firebaseTags as tags } from '../../config';
import { generateKey, generateToken } from '../../utils';

class Firebase {
  app: firebase.FirebaseApp;
  db: firestore.Firestore;
  constructor() {
    let app;
    const config = getFirebaseConfig();
    const firebaseConfigureJson = {
      apiKey: config.FIREBASE_API_KEY,
      authDomain: config.FIREBASE_AUTH_DOMAIN,
      projectId: config.PROJECT_ID,
      storageBucket: config.STORAGE_BUCKET,
      messagingSenderId: config.MESSAGING_SENDER_ID,
      appId: config.APP_ID,
    };
    try {
      const firebaseApps = firebase.getApp(tags.firebaseTag);
      app = firebaseApps;
    } catch (error) {
      app = firebase.initializeApp(
        { ...firebaseConfigureJson },
        tags.firebaseTag,
      );
    }
    this.app = app;
    this.db = firestore.getFirestore(this.app);
  }
  async getUser(userId: string) {
    const userDocRef = firestore.doc(this.db, tags.userCollectionTag, userId);
    const userDocSnapShot = await firestore.getDoc(userDocRef);
    if (!userDocSnapShot.exists()) {
      throw new Error('User not found');
    }
    return userDocSnapShot.data();
  }
  async setUser(userId: string, data: GooglePayload) {
    const updateRef = firestore.doc(this.db, tags.userCollectionTag, userId);
    const userRef = await firestore.getDoc(updateRef);
    let userData: any = {};
    if (userRef.exists()) {
      userData = userRef.data();
    }
    if (!userData.API_SECRET) {
      userData.API_SECRET = generateToken({
        ...userData,
        ...data,
      });
    }
    if (!userData.API_KEY) {
      userData.API_KEY = generateKey();
    }

    await firestore.setDoc(updateRef, {
      ...userData,
      ...data,
      login_time: new Date(),
    });
    return {
      ...userData,
      ...data,
    };
  }
  async getSheetSettings(userId: string) {
    const sheetDocRef = firestore.doc(this.db, tags.sheetCollectionTag,userId);
    const userDocSnapShot = await firestore.getDoc(sheetDocRef);
    if (!userDocSnapShot.exists()) {
      return {};
    }
    return userDocSnapShot.data();
  }
}

export default Firebase;