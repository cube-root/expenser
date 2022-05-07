// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getKeys } from '../../../../backend';
type Data = {
  API_KEY?: string,
  API_SECRET?: string,
  message?: string,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method === 'POST') {
    if (!req.headers.authorization || req.headers.authorization.split(' ')[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    try {
      const response = await getKeys(req.headers.authorization.split(' ')[1]);
      return res.status(200).json(response);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  } else {

    return res.status(500).json({ message: 'Method not allowed' });
  }
}
