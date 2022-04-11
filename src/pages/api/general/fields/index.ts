// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import backendHandler from '../../../../backend';

type Data = any;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const template = backendHandler.general.addExpenseFields();
  res.status(200).json(template);
}
