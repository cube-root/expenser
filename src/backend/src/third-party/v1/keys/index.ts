import axios from "axios";
import { verifyGoogleOathAccessToken } from '../../../../helper/keys';
import { getApp,getDB,getUserByEmail } from '../../../api-helper/firebase/operations';
const getKeys = async (oathAccessToken: string) => {
    // token verification
    let publicKey = await axios.get('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com')
    publicKey = publicKey.data;
    const payload: any = verifyGoogleOathAccessToken(oathAccessToken, publicKey);
    if (payload.email_verified === true) {
        const emailId = payload.email;
        const app = getApp();
        const db = getDB(app);
        const key = await getUserByEmail(db,emailId);
        return key
    }
    throw new Error("Email not verified");
}

export {
    getKeys
}