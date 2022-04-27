import jwt from 'jsonwebtoken';
import {customAlphabet} from 'nanoid';

const generateKey = (len = 30) => {
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ#$&()', len)
    return nanoid();
}


const generateToken = (data:any)=>{
    return jwt.sign(data,process.env.JWT_SECRET || 'TEST_TOKEN');
}

export {
    generateToken,
    generateKey
}