import axios from "axios";
import { verifyGoogleOathAccessToken } from '../helper/token';
import FirebaseService from "../helper/firebase";


const getKeys = async(oathAccessToken:string)=>{
    // token verification
    let publicKey = await axios.get('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com')
    publicKey = publicKey.data;
    const payload: any = verifyGoogleOathAccessToken(oathAccessToken, publicKey);
    if (payload.email_verified === true) {
        const emailId = payload.email;
        const firebase = new FirebaseService();
        const key = await firebase.getUserByEmail(emailId);
        return key
    }
    throw new Error("Email not verified");
}

const revokeKeys = async(oathAccessToken:string)=>{
    // token verification
    let publicKey = await axios.get('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com')
    publicKey = publicKey.data;
    const payload: any = verifyGoogleOathAccessToken(oathAccessToken, publicKey);
    if (payload.email_verified === true) {
        const emailId = payload.email;
        const firebase = new FirebaseService();
        const key = await firebase.getUserByEmail(emailId);
        return key
    }
    throw new Error("Email not verified");
}

export {
    getKeys,
    revokeKeys
}