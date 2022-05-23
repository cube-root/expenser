import type { NextApiRequest, NextApiResponse } from 'next';
import {
    Telegram,
    verifyToken
} from '../../../../../backend';

export default async function api(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    if (req.method === 'POST') {
        const { data } = req.body;
        if (!req.headers['x-access-token']) {
            return res.status(401).json({
                error: 'Header is missing',
            });
        }
        const tokenData = await verifyToken(req.headers['x-access-token'], process.env.WEBHOOK_TOKEN);
        const { chatId } = tokenData;
        try {
            const telegram = new Telegram({
                CHAT_ID: typeof chatId  === 'string' ? chatId : `${chatId}`,
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
