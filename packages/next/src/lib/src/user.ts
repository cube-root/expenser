import axios from "axios";
import {verifyGoogleOathAccessToken} from '../helper/token';

class User {
    accessToken: string;
    constructor(accessToken:string){
        this.accessToken = accessToken;
    }
    async verifyUser(){
        let publicKey = await axios.get('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
        publicKey = publicKey.data;
        const payload: any = verifyGoogleOathAccessToken(this.accessToken, publicKey);
        return payload;
    }
    
}

export default User;