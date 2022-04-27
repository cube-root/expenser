import type { NextApiRequest, NextApiResponse } from 'next';
import { sheets } from '../../../../backend';
const { appendSpreadSheet } = sheets;
export default async function api(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    if (req.method === 'POST') {
        const { sheetId } = req.query;
        const { data } = req.body;
        const response = await appendSpreadSheet({ sheetId, data });
        return res.status(200).json(response)
    } else {
        return res.status(500).json({
            message: "Method not allowed"
        })
    }
}
