import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import { getApp, getDB, getUser } from '../src/api-helper/firebase/operations';

const getAccessToken: any = async () => {
    return new Promise(function (resolve, reject) {
        const jwtClient = new google.auth.JWT(
            process.env.CLIENT_EMAIL,
            undefined,
            process.env.SERVICE_ACCOUNT_PRIVATE_KEY,
            ['https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/spreadsheets.readonly'
            ],
            undefined
        );
        jwtClient.authorize(function (err, tokens: any) {
            if (err) {
                reject(err);
                return;
            }
            resolve(tokens.access_token);
        });
    });
}

const verifyKey: any = async (token: any) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'TEST_TOKEN');
    } catch (error) {
        throw new Error('Verification Failed')
    }
}

const verifySecret:any = async (API_SECRET:any,uuid:any) => {
    const app = getApp();
    const db = getDB(app);
    const userData = await getUser(db, uuid);
    if (userData.API_SECRET !== API_SECRET) {
        throw new Error('Authentication Failed');
    }
}
export {
    getAccessToken,
    verifyKey,
    verifySecret
}