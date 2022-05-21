import type { NextApiRequest, NextApiResponse } from 'next';
import {settings} from '../../../../backend';
const api = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        try {
            const {
                'x-api_key': API_KEY,
                'x-api_secret' :API_SECRET
            } = req.headers;
            if (!API_KEY || !API_SECRET) {
                throw new Error('Keys missing');
            }
            const response = await settings.getGeneralSettings({
                API_KEY: API_KEY,
                API_SECRET: API_SECRET
            })
            return res.status(200).json(response)
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || 'Get api failed'
            })
        }
    }
}
export default api;