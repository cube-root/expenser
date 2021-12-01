// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import handler from '../../../../backend';

type Data = {
    status: Boolean
    message?: String,
    data?: Array<any>
}

export default async function api(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { accessToken } = req.body;
    try {
        const response = await handler.sheets.createSpreadSheet(accessToken, { spreadsheetId: 'expenser' })
        res
            .status(200)
            .send({
                status: true,
                data: response
            })
    } catch (error: any) {
        console.error('sheet create api:', error);
        res
            .status(500)
            .send({
                status: false,
                message: error.message || 'Something went wrong !!'
            })
    }

}
