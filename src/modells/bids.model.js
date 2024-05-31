import db from '../db/config.js';

// Define the bids schema
const bidSchema = {
    id: 'INT AUTO_INCREMENT PRIMARY KEY',
    item_id: 'INT NOT NULL',
    user_id: 'INT NOT NULL',
    bid_amount: 'DECIMAL(10, 2) NOT NULL',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    FOREIGN_KEY_ITEM: 'FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE',
    FOREIGN_KEY_USER: 'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE'
};

// Function to create the bids table
const createBidsTable = async () => {
    const columns = Object.entries(bidSchema)
        .map(([column, type]) => `${column} ${type}`)
        .join(', ');

    const query = `CREATE TABLE IF NOT EXISTS bids (${columns})`;
    await db.execute(query);
};

// Function to create a new bid
const createBid = async ({ item_id, user_id, bid_amount }) => {
    const query = `INSERT INTO bids (item_id, user_id, bid_amount) VALUES (?, ?, ?)`;
    const [result] = await db.execute(query, [item_id, user_id, bid_amount]);
    return result.insertId;
};

// Function to get bids by item ID
const getBidsByItemId = async (item_id) => {
    const query = `SELECT * FROM bids WHERE item_id = ?`;
    const [bids] = await db.execute(query, [item_id]);
    return bids;
};

// Export the functions
export {
    createBidsTable,
    createBid,
    getBidsByItemId
};
