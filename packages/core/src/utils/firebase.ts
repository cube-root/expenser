const getFirebaseConfig = (): FirebaseConfig => {
  
    return {
      FIREBASE_API_KEY: process.env.apiKey,
      FIREBASE_AUTH_DOMAIN: process.env.authDomain,
      PROJECT_ID: process.env.projectId,
      STORAGE_BUCKET: process.env.storageBucket,
      MESSAGING_SENDER_ID: process.env.messagingSenderId,
      APP_ID: process.env.appId,
      CLIENT_EMAIL: process.env.CLIENT_EMAIL,
    }
  }


export {
    getFirebaseConfig,
}