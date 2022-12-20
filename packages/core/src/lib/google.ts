import axios from "axios";
import jwt from 'jsonwebtoken';

class Google {
    accessToken: string;
    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }
    verifyToken(publicKey:any){
        const header64 = this.accessToken.split('.')[0];
        const header = JSON.parse(Buffer.from(header64, 'base64').toString('ascii'));
        try {
            const payload = jwt.verify(this.accessToken, publicKey[header.kid], { algorithms: ['RS256'] });
            return payload;
        } catch (error) {
            throw new Error('JWT not verified');
        }
    }
    async verifyUser() {
        let publicKey:any = await axios.get('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
        publicKey = publicKey.data;
        const payload = this.verifyToken(publicKey);
        return payload;
    }   
}

export default Google;