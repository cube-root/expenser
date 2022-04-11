// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../../../backend';

type Data = {
  status: boolean;
  message?: string;
  data?: Array<any>;
};

export default async function api(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { accessToken } = req.body;
  try {
    const properties = {
      properties: {
        title: 'expenser',
      },
    };
    const response = await handler.sheets.createSpreadSheet(
      accessToken,
      properties,
    );
    res.status(200).send({
      status: true,
      data: response,
    });
  } catch (error: any) {
    console.error('sheet create api:', error.response.data);
    res.status(500).send({
      status: false,
      message: error.message || 'Something went wrong !!',
    });
  }
}
