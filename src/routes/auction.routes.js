// routes/auctionRoutes.js
import express from 'express';
import { createAuction, getAllAuctions, getAuctionById, updateAuction, deleteAuction } from '../controller/auction.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authenticateToken, createAuction);
router.get('/', getAllAuctions);
router.get('/:id', getAuctionById);
router.put('/:id', authenticateToken, updateAuction);
router.delete('/:id', authenticateToken, deleteAuction);

export default router;
