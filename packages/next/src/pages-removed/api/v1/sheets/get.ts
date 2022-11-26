import type { NextApiRequest, NextApiResponse } from 'next';
import { Sheets } from '../../../../lib';


export default async function api(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    if (req.method === 'GET') {
        const { sheetId } = req.query;
        const { api_secret: API_SECRET, api_key: API_KEY } = req.headers;
        if (!API_KEY || !API_SECRET) {
            return res.status(401).json({
                error: 'Authorization header is missing',
            });

        }
        try {
            const sheet = new Sheets({
                API_KEY,
                API_SECRET,
                sheetId
            });
            const data = await sheet.get();
            return res.status(200).json(data)
        } catch (error: any) {
            return res.status(500).json({
                error: error?.response?.data?.error?.message || 'Get api failed',
                details: error?.response?.data
            })
        }
    } else {
        return res.status(500).json({
            error: "Method not allowed"
        })
    }
}
