// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {
    Telegram,
    verifyToken
} from '../../../../../lib';

const api = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        if (!req.headers['x-access-token']) {
            return res.status(401).json({
                error: 'Header is missing',
            });
        }
        const tokenData = await verifyToken(req.headers['x-access-token'], process.env.WEBHOOK_TOKEN);
        const { chatId } = tokenData;
        const {
            sheetId,
            sheetLink
        } = req.body;
        const telegram = new Telegram({
            CHAT_ID: typeof chatId  === 'string' ? chatId : `${chatId}`
        })
        await telegram.changeSheet(sheetId, sheetLink);
        return res.status(200).json({ message: 'done' });

    }
    return res.status(500).json({ message: 'Method not allowed' });
}

export default api;