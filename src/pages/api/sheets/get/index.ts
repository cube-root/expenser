import type { NextApiRequest, NextApiResponse } from 'next'
import handler from '../../../../backend';

type Data = {
    status: Boolean,
    data?: any,
    message?: String,
    serverError?: String,
    actualErrorCode ?: Number
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
        const errorValue = error?.response?.data?.error?.message;
        const actualErrorCode = error?.response?.data?.error?.code;
        res
            .status(500)
            .send({
                status: false,
                message: error.message || 'Something went wrong !!',
                serverError: errorValue ,
                actualErrorCode
            })
    }
}