import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import Firebase from './firebase';


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

const verifyKey: any = async (token: any, secret?: string) => {
    const key = secret ? secret : (process.env.JWT_SECRET || 'TEST_TOKEN');
    try {
        return jwt.verify(token, key);
    } catch (error) {
        throw new Error('Verification Failed')
    }
}

const verifySecret: any = async (API_SECRET: any, uuid: any) => {
    const firebase = new Firebase();
    const userData = await firebase.getUser(uuid);
    if (userData.API_SECRET !== API_SECRET) {
        throw new Error('Authentication Failed');
    }
}

const verifyGoogleOathAccessToken = (oathToken: string, publicKeys: any) => {
    const header64 = oathToken.split('.')[0];
    const header = JSON.parse(Buffer.from(header64, 'base64').toString('ascii'));
    try {
        const payload = jwt.verify(oathToken, publicKeys[header.kid], { algorithms: ['RS256'] });
        return payload;
    } catch (error) {
        throw new Error('JWT not verified');
    }
}

export {
    getAccessToken,
    verifyKey,
    verifySecret,
    verifyGoogleOathAccessToken
}