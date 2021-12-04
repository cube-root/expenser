import type { NextApiRequest, NextApiResponse } from 'next'
import handler from '../../../../backend';

type Data = {
    status: Boolean,
    data?: any,
    message?: String,
}

export default async function api(req: NextApiRequest,
    res: NextApiResponse<Data>) {
    const { accessToken, sheetId } = req.body;
    try {
        const response = await handler.sheets.getSpreadSheetValue(accessToken, sheetId,'')
        res
            .status(200)
            .send({
                status: true,
                data: response
            })
    } catch (error: any) {
        console.error('sheet get api:', error.response.data,'\n\n',JSON.stringify(error.response.data));
        res
            .status(500)
            .send({
                status: false,
                message: error.message || 'Something went wrong !!'
            })
    }
}