// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {
    Telegram
} from '../../../../../backend';

const api = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { chat_id: chatId } = req.headers;
        if (!chatId) {
            return res.status(401).json({
                error: 'Header is missing',
            });
        }
        const {
            sheetId,
            sheetLink
        } = req.body;
        const telegram = new Telegram({
            CHAT_ID: chatId
        })
        await telegram.changeSheet(sheetId,sheetLink);
        return res.status(200).json({ message: 'done' });

    }
    return res.status(500).json({ message: 'Method not allowed' });
}

export default api;