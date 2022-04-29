import { extractSheet } from './extract-sheet-id';
import { generateToken, generateKey } from './jwt';
type FirebaseConfigType = {
  FIREBASE_API_KEY: string | any;
  FIREBASE_AUTH_DOMAIN: string | any;
  PROJECT_ID: string | any;
  STORAGE_BUCKET: string | any;
  MESSAGING_SENDER_ID: string | any;
  APP_ID: string | any;
  CLIENT_EMAIL: string | any;
};

const getFirebaseConfig = (): FirebaseConfigType => {
  return {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    PROJECT_ID: process.env.PROJECT_ID,
    STORAGE_BUCKET: process.env.STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
    APP_ID: process.env.APP_ID,
    CLIENT_EMAIL: process.env.CLIENT_EMAIL,
  }
}

const helper = {
  extractSheet,
  getFirebaseConfig,

};
export {
  generateToken,
  generateKey,
  getFirebaseConfig
}
export default helper;
