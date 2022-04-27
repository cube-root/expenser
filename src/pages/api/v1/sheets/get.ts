import type { NextApiRequest, NextApiResponse } from 'next';
import { sheets } from '../../../../backend';
const { getSpreadSheetValue } = sheets;

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
            const data = await getSpreadSheetValue({ sheetId }, { API_KEY, API_SECRET });
            return res.status(200).json(data)
        } catch (error: any) {
            return res.status(500).json({ error: error.message || 'Get api failed' })
        }
    } else {
        return res.status(500).json({
            error: "Method not allowed"
        })
    }
}
