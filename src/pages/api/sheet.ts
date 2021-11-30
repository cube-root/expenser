// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import handler from '../../backend';
import axios from 'axios';

type Data = {
    status: Boolean
    message?: String,
    data?: Array<any>
}

export default async function api(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        const {accessToken,spreadSheetId} = req.body;
        const response = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${spreadSheetId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                redirect: "follow"
            }
        })
        res
            .status(200)
            .send({
                status: true,
                data: response.data
            })
    } catch (error: any) {
        console.log(error);
        console.log(error.response.data);
        res
            .status(500)
            .send({
                status: false,
                message: error.message || 'Something went wrong !!'
            })
    }

}