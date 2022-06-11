import type { NextApiRequest, NextApiResponse } from 'next';
import {
    User
} from '../../../../lib'
const api = async (req: NextApiRequest, res: NextApiResponse) => {
    const {
        accessToken
    } = req.body;
    if (!accessToken) {
        return res.status(401).send("accessToken is required");
    }
    if (req.method === 'POST') {
        try {
            const user = new User(accessToken);
            const value = await user.registerUser();
            return res.status(200).json(value)
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || 'Get api failed'
            })
        }
    }
    return res.status(500).json({ message: 'Method not allowed' });
}
export default api;