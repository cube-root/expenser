/* eslint-disable import/prefer-default-export */
import jwt from 'jsonwebtoken';

const generateToken = (data: any) => jwt.sign(data, process.env.TOKEN || 'TEST_TOKEN');

export {
  generateToken,
};
