import {
    createNotification,
    getNotificationsByUserId,
    markNotificationAsRead
} from '../modells/notification.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponses.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Create a new notification
export const sendNotification = asyncHandler(async (req, res, next) => {
    const { user_id, message } = req.body;

    if (!user_id || !message) {
        throw new ApiError(400, 'User ID and message are required');
    }

    const notificationId = await createNotification({ user_id, message });
    res.status(201).json(new ApiResponse(201, { notificationId }, 'Notification sent successfully'));
});

// Get notifications by user ID
export const getNotifications = asyncHandler(async (req, res, next) => {
    const user_id = req.user.id;

    const notifications = await getNotificationsByUserId(user_id);
    res.status(200).json(new ApiResponse(200, notifications, 'Notifications fetched successfully'));
});

// Mark a notification as read
export const markAsRead = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const updated = await markNotificationAsRead(id);
    if (!updated) {
        throw new ApiError(404, 'Notification not found');
    }

    res.status(200).json(new ApiResponse(200, null, 'Notification marked as read'));
});
