import type { NextApiRequest, NextApiResponse } from 'next';
import {
    User,
    verifyToken
} from '../../../../lib'
const api = async (req: NextApiRequest, res: NextApiResponse) => {
    const {
        accessToken
    } = req.body;
    if (!accessToken) {
        return res.status(401).send("accessToken is required");
    }

    if (req.method === 'POST') {
        try {
            const tokenData = await verifyToken(accessToken, process.env.WEBHOOK_TOKEN);
            const { chatId } = tokenData;
            const user = new User();
            let userData = await user.getUserByTelegramChatId(typeof chatId === 'string' ? chatId : chatId.toString());
            const { uuid } = userData;
            userData = await user.getUserData(typeof uuid === 'string' ? uuid : uuid.toString());
            return res.status(200).json(userData)
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || 'Get api failed'
            })
        }
    }
    return res.status(500).json({ message: 'Method not allowed' });
}
export default api;