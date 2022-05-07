import jwt from 'jsonwebtoken';

const verifyGoogleOathAccessToken = (oathToken:string,publicKeys:any)=>{
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
    verifyGoogleOathAccessToken
}