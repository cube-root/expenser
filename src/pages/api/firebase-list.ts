// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import handler from '../../backend';
type Data = {
  name: string
}

export default async function api(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { accessToken } = req.body;
  try {
    const response = await handler.firebase.listProject(accessToken)
    res.status(200).send(response)
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false })
  }

}
