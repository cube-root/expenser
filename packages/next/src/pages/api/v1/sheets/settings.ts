import type { NextApiRequest, NextApiResponse } from 'next';
import {
    settings, Sheets
} from '../../../../lib'
const api = async (req: NextApiRequest, res: NextApiResponse) => {
    const {
        'x-api_key': API_KEY,
        'x-api_secret': API_SECRET
    } = req.headers;
    if (req.method === 'GET') {
        try {
            if (!API_KEY || !API_SECRET) {
                return res.status(401).send("Unauthenticated");
            }
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
    if (req.method === 'POST') {
        try {
            const {
                sheetId,
                sheetLink,
                name
            } = req.body;
            const sheets = new Sheets({
                API_KEY: API_KEY || '',
                API_SECRET: API_SECRET || '',
                sheetId
            })
            const value = await sheets.changeSheet(sheetId, sheetLink, name);
            return res.status(200).json(value);
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || 'POST api failed'
            })
        }
    }
    return res.status(200).json({ message: 'Method not allowed' });
}
export default api;