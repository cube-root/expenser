// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import navigation from '../../../../config/navigation';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ navigation });
}
