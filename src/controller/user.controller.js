// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/config.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponses.js';
import {asyncHandler} from '../utils/asyncHandler.js';

// Register user with asyncHandler
export const register = asyncHandler(async (req, res,next) => {
    //  res.status(200).json({
    //     message:"ok"
    // })

    const { username, email, password } = req.body;
  
    // Validate inputs
    if (!username || !email || !password) {
      throw new ApiError(400, 'Username, email, and password are required');
    }
  
    // Log the inputs to debug
    console.log('Registering user with:', { username, email, password });
  
    // Hash the password
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
      if (existingUser.length > 0) {
        throw new ApiError(409, 'User with email or username already exists');
      }
  
      const [result] = await db.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
      const createdUser = { id: result.insertId, username, email, role: 'user' }; // Assuming role is default 'user'
      return res.status(201).json(new ApiResponse(201, createdUser, 'User registered successfully'));
    }
     catch (error) {
      next(error);
    // console.log(err)
    }
  });
  
  // Login user with asyncHandler
  export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
  
    // Validate inputs
    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }
  
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];
  
    if (!user) {
      throw new ApiError(401, 'Authentication failed');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Authentication failed');
    }
  
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    return res.status(200).json(new ApiResponse(200, { token }, 'Authentication successful'));
  });
  // Get user profile with asyncHandler
export const getProfile = asyncHandler(async (req, res, next) => {
  const { userId } = req.user;

  const [users] = await db.execute('SELECT id, username, email, role FROM users WHERE id = ?', [userId]);
  const user = users[0];

  if (!user) {
      throw new ApiError(404, 'User not found');
  }

  return res.status(200).json(new ApiResponse(200, user, 'Profile fetched successfully'));
});