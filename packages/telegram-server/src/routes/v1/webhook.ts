import express from 'express';
import auth from '../../middleware/auth';
import { bot } from '../../index';

const router = express.Router({ mergeParams: true });

router.get('/send-message', auth, async (req, res) => {
  try {
    const {
      chatId,
      text,
    } = req.query;
    if (chatId && text) {
      try {
        await bot.sendMessage(chatId, text);
      } catch (error:any) {
        throw new Error(error);
      }
    }
    return res.status(200).json({
      message: 'done',
    });
  } catch (error) {
    return res.status(200).json({ message: 'error' });
  }
});

export default router;
