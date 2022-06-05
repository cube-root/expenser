import type { NextApiRequest, NextApiResponse } from 'next';
import {
    settings
} from '../../../../lib'
const api = async (req: NextApiRequest, res: NextApiResponse) => {
    const {
        'x-api_key': API_KEY,
        'x-api_secret': API_SECRET
    } = req.headers;
    if (!API_KEY || !API_SECRET) {
        return res.status(401).send("Unauthenticated");
    }
    if (req.method === 'GET') {
        try {
            const value = await settings.get({
                API_KEY: API_KEY,
                API_SECRET: API_SECRET
            })
            return res.status(200).json(value)
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || 'Get api failed'
            })
        }
    }
    return res.status(500).json({ message: 'Method not allowed' });
}
export default api;