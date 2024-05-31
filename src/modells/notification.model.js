import db from '../db/config.js';

// Define the notifications schema
const notificationSchema = {
    id: 'INT AUTO_INCREMENT PRIMARY KEY',
    user_id: 'INT NOT NULL',
    message: 'VARCHAR(255) NOT NULL',
    is_read: 'BOOLEAN DEFAULT false',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    FOREIGN_KEY_USER: 'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE'
};

// Function to create the notifications table
const createNotificationsTable = async () => {
    const columns = Object.entries(notificationSchema)
        .map(([column, type]) => `${column} ${type}`)
        .join(', ');

    const query = `CREATE TABLE IF NOT EXISTS notifications (${columns})`;
    await db.execute(query);
};

// Function to create a new notification
const createNotification = async ({ user_id, message }) => {
    const query = `INSERT INTO notifications (user_id, message) VALUES (?, ?)`;
    const [result] = await db.execute(query, [user_id, message]);
    return result.insertId;
};

// Function to get notifications by user ID
const getNotificationsByUserId = async (user_id) => {
    const query = `SELECT * FROM notifications WHERE user_id = ?`;
    const [notifications] = await db.execute(query, [user_id]);
    return notifications;
};

// Function to mark a notification as read
const markNotificationAsRead = async (id) => {
    const query = `UPDATE notifications SET is_read = true WHERE id = ?`;
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
};

// Export the functions
export {
    createNotificationsTable,
    createNotification,
    getNotificationsByUserId,
    markNotificationAsRead
};
