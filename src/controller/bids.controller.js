import {
    createBid,
    getBidsByItemId
} from '../modells/bids.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponses.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Create a new bid
export const placeBid = asyncHandler(async (req, res, next) => {
    const { item_id, bid_amount } = req.body;
    const user_id = req.user.id;

    if (!item_id || !bid_amount) {
        throw new ApiError(400, 'Item ID and bid amount are required');
    }

    const bidId = await createBid({ item_id, user_id, bid_amount });
    res.status(201).json(new ApiResponse(201, { bidId }, 'Bid placed successfully'));
});

// Get bids by item ID
export const getBids = asyncHandler(async (req, res, next) => {
    const { item_id } = req.params;

    const bids = await getBidsByItemId(item_id);
    res.status(200).json(new ApiResponse(200, bids, 'Bids fetched successfully'));
});
