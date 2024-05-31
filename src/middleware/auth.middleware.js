// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next(new ApiError(401, 'Token not provided'));
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return next(new ApiError(403, 'Token is invalid'));
        }
        req.user = user;
        next();
    });
};
