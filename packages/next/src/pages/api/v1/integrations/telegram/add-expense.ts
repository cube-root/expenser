import type { NextApiRequest, NextApiResponse } from 'next';
import {
    Telegram
} from '../../../../../backend';

export default async function api(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    if (req.method === 'POST') {
        const { data } = req.body;
        const { chat_id: chatId } = req.headers;
        if (!chatId) {
            return res.status(401).json({
                error: 'Header is missing',
            });
        }
        try {
            const telegram = new Telegram({
                CHAT_ID: chatId
            })
            const response = await telegram.addExpense({
                amount: data.amount,
                remark: data.remark === undefined ? '' : data.remark,
                symbol: data.symbol,
                type: data.type,
            })
            return res.status(200).json(response)
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Something went wrong',
            })
        }

    } else {
        return res.status(500).json({
            message: "Method not allowed"
        })
    }
}
