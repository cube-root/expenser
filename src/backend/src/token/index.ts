import axios from "axios";
import {google} from 'googleapis';


const getAccessToken:any = async()=>{
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
        jwtClient.authorize(function (err, tokens:any) {
            if (err) {
                reject(err);
                return;
            }
            resolve(tokens.access_token);
        });
    });
}

export {
    getAccessToken
}