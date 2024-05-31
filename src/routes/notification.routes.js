import express from 'express';
import { sendNotification, getNotifications, markAsRead } from '../controller/notification.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', sendNotification);
router.get('/', authenticateToken, getNotifications);
router.put('/:id/read', authenticateToken, markAsRead);

export default router;
