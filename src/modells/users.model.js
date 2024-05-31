import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/config.js';

const userSchema = {
    username: {
        type: 'VARCHAR(255)',
        allowNull: false,
        unique: true
    },
    password: {
        type: 'VARCHAR(255)',
        allowNull: false
    },
    email: {
        type: 'VARCHAR(255)',
        allowNull: false,
        unique: true
    },
    role: {
        type: 'ENUM("user", "admin")',
        defaultValue: 'user'
    },
    createdAt: {
        type: 'TIMESTAMP',
        defaultValue: db.fn('NOW')
    }
};

// Hash the password before saving
userSchema.preSave = async function () {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
};

// Check if the provided password is correct
userSchema.isPasswordCorrect = async function (password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate an access token
userSchema.generateAccessToken = function () {
  return jwt.sign({
    _id: this._id,
    email: this.email,
    username: this.username,
    fullName: this.fullName
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY    
  });
};

// Generate a refresh token
userSchema.generateRefreshToken = function () {
  return jwt.sign({
    _id: this._id
  },
  process.env.REFRESH_TOKEN_SECRET,
  {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY    
  });
};

// Export the user schema
export const User = db.define('User', userSchema);
