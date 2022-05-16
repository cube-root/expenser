import express from 'express';
import webhook from './webhook';

const router = express.Router({ mergeParams: true });

router.use('/webhooks', webhook);

export default router;
