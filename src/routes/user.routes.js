// routes/authRoutes.js
import express from 'express';
import { register, login,getProfile } from '../controller/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);



export default router;
