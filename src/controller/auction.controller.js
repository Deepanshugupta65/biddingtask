// controllers/auctionController.js
import db from '../db/config.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponses.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {upload} from '../middleware/multer.middleware.js'; // Import Multer configuration

// Middleware to check if user is the owner or admin
const isOwnerOrAdmin = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { userId, role } = req.user;

    const [auctions] = await db.execute('SELECT * FROM auctions WHERE id = ?', [id]);
    const auction = auctions[0];

    if (!auction) {
        throw new ApiError(404, 'Auction item not found');
    }

    if (auction.userId !== userId && role !== 'admin') {
        throw new ApiError(403, 'Forbidden');
    }

    next();
});

// Create a new auction item
export const createAuction = [
    upload.single('image'), // Handle image upload
    asyncHandler(async (req, res, next) => {
        const { name, description, starting_price, end_time } = req.body;
        const image_url = req.file ? req.file.path : null;
        const { userId } = req.user;

        // Validate inputs
        if (!name || !description || !starting_price || !end_time) {
            throw new ApiError(400, 'Name, description, starting price, and end time are required');
        }

        try {
            const current_price = starting_price;
            const [result] = await db.execute(
                'INSERT INTO auctions (name, description, starting_price, current_price, image_url, end_time, created_at, userId) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)',
                [name, description, starting_price, current_price, image_url, end_time, userId]
            );
            const createdAuction = { id: result.insertId, name, description, starting_price, current_price, image_url, end_time, userId };
            return res.status(201).json(new ApiResponse(201, createdAuction, 'Auction item created successfully'));
        } catch (error) {
            next(error);
        }
    })
];

// Get all auction items with pagination
export const getAllAuctions = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const [auctions] = await db.execute('SELECT * FROM auctions LIMIT ? OFFSET ?', [parseInt(limit), parseInt(offset)]);
        const [count] = await db.execute('SELECT COUNT(*) AS total FROM auctions');
        return res.status(200).json(new ApiResponse(200, { auctions, total: count[0].total }, 'Auction items fetched successfully'));
    } catch (error) {
        next(error);
    }
});

// Get a single auction item by ID
export const getAuctionById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        const [auctions] = await db.execute('SELECT * FROM auctions WHERE id = ?', [id]);
        const auction = auctions[0];

        if (!auction) {
            throw new ApiError(404, 'Auction item not found');
        }

        return res.status(200).json(new ApiResponse(200, auction, 'Auction item fetched successfully'));
    } catch (error) {
        next(error);
    }
});

// Update an auction item by ID
export const updateAuction = [
    upload.single('image'), // Handle image upload
    isOwnerOrAdmin, // Check if user is owner or admin
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const { name, description, starting_price, current_price, end_time } = req.body;
        const image_url = req.file ? req.file.path : null;

        // Validate inputs
        if (!name || !description || !starting_price || !end_time) {
            throw new ApiError(400, 'Name, description, starting price, and end time are required');
        }

        try {
            const [result] = await db.execute(
                'UPDATE auctions SET name = ?, description = ?, starting_price = ?, current_price = ?, image_url = ?, end_time = ? WHERE id = ?',
                [name, description, starting_price, current_price, image_url, end_time, id]
            );

            if (result.affectedRows === 0) {
                throw new ApiError(404, 'Auction item not found');
            }

            const updatedAuction = { id, name, description, starting_price, current_price, image_url, end_time };
            return res.status(200).json(new ApiResponse(200, updatedAuction, 'Auction item updated successfully'));
        } catch (error) {
            next(error);
        }
    })
];

// Delete an auction item by ID
export const deleteAuction = [
    isOwnerOrAdmin, // Check if user is owner or admin
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;

        try {
            const [result] = await db.execute('DELETE FROM auctions WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                throw new ApiError(404, 'Auction item not found');
            }

            return res.status(200).json(new ApiResponse(200, null, 'Auction item deleted successfully'));
        } catch (error) {
            next(error);
        }
    })
];
