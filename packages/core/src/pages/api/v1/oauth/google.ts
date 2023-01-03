import type { NextApiRequest, NextApiResponse } from 'next';
import User from '../../../../lib/user';
import Sheets from '../../../../lib/sheets';
const api = async (req: NextApiRequest, res: NextApiResponse) => {
  const { accessToken } = req.body;
  if (!accessToken) {
    return res.status(401).send('accessToken is required');
  }
  if (req.method === 'POST') {
    try {
      const user = new User(accessToken);
      const userData = await user.login();
      const sheets = new Sheets(accessToken);
      const sheetSettings = await sheets.getSheetSettings(userData.user_id);
      return res.status(200).json({ user: userData, sheets: sheetSettings });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || 'Get api failed',
      });
    }
  }
  return res.status(500).json({ message: 'Method not allowed' });
};
export default api;
