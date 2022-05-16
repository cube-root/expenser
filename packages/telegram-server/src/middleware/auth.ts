import { NextFunction, Request, Response } from 'express';

const auth = (req:Request, res:Response, next:NextFunction) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const token = req.headers.authorization.split(' ')[1];
    if (token === process.env.TOKEN) {
      return next();
    }
  }
  return res.status(401).send({
    message: 'Auth failed',
  });
};

export default auth;
