// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  User,
  verifyToken
} from '../../../../../lib';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method === 'POST') {
    try {
      const {
        "x-access-token": token
      } = req.headers;
      if (!token) {
        throw new Error('Token not found');
      }
      const tokenData = await verifyToken(req.headers['x-access-token'], process.env.WEBHOOK_TOKEN);
      const { chatId } = tokenData;
      const user = new User();
      await user.getUserByTelegramChatId(typeof chatId === 'string' ? chatId : chatId.toString());
      return res.status(200).json({})
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  } else {

    return res.status(500).json({ message: 'Method not allowed' });
  }
}
