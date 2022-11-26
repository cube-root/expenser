import type { NextApiRequest, NextApiResponse } from 'next';
import { Sheets } from '../../../../lib';

export default async function api(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    if (req.method === 'POST') {
        try {
            const { sheetId } = req.query;
            const { data } = req.body;
            const { api_secret: API_SECRET, api_key: API_KEY } = req.headers;
            if (!API_KEY || !API_SECRET) {
                return res.status(401).json({
                    error: 'Authorization header is missing',
                });
            }
            const sheet = new Sheets({
                API_KEY,
                API_SECRET,
                sheetId
            });
            const response = await sheet.post(data);
            return res.status(200).json(response)
        } catch (error: any) {
            return res.status(500).json({
                error: error?.response?.data?.error?.message || 'POST api failed',
                details: error?.response?.data
            })
        }
    } else {
        return res.status(500).json({
            error: "Method not allowed"
        })
    }
}
