export {}

declare global {
    interface FirebaseConfig {
        FIREBASE_API_KEY: string | any;
        FIREBASE_AUTH_DOMAIN: string | any;
        PROJECT_ID: string | any;
        STORAGE_BUCKET: string | any;
        MESSAGING_SENDER_ID: string | any;
        APP_ID: string | any;
        CLIENT_EMAIL: string | any;
    }
}