// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  thirdParty
} from '../../../../../backend';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method === 'POST') {
    try {
      const response = await thirdParty.v1.telegram.configure({
          API_SECRET: req.body.API_SECRET,
          CHAT_ID: req.body.CHAT_ID
      });
      return res.status(200).json(response);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  } else {

    return res.status(500).json({ message: 'Method not allowed' });
  }
}
