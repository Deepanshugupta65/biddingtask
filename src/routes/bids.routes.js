import express from 'express';
import { placeBid, getBids } from '../controller/bids.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authenticateToken, placeBid);
router.get('/:item_id', getBids);

export default router;
