import db from '../config/database.js';

// Define the auction schema
const auctionSchema = {
    id: 'INT AUTO_INCREMENT PRIMARY KEY',
    name: 'VARCHAR(255) NOT NULL',
    description: 'TEXT NOT NULL',
    starting_price: 'DECIMAL(10, 2) NOT NULL',
    current_price: 'DECIMAL(10, 2) DEFAULT 0',
    image_url: 'VARCHAR(255)',
    end_time: 'TIMESTAMP NOT NULL',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
};

// Function to create the auctions table
const createAuctionsTable = async () => {
    const columns = Object.entries(auctionSchema)
        .map(([column, type]) => `${column} ${type}`)
        .join(', ');

    const query = `CREATE TABLE IF NOT EXISTS auctions (${columns})`;
    await db.execute(query);
};

// Function to create a new auction
const createAuction = async ({ name, description, starting_price, end_time, image_url }) => {
    const query = `
        INSERT INTO auctions (name, description, starting_price, current_price, end_time, image_url)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
        name,
        description,
        starting_price,
        starting_price, // Default current_price to starting_price
        end_time,
        image_url
    ]);
    return result.insertId;
};

// Function to get an auction by ID
const getAuctionById = async (id) => {
    const query = `SELECT * FROM auctions WHERE id = ?`;
    const [auctions] = await db.execute(query, [id]);
    return auctions[0];
};

// Function to update an auction by ID
const updateAuction = async (id, { name, description, starting_price, current_price, end_time, image_url }) => {
    const query = `
        UPDATE auctions
        SET name = ?, description = ?, starting_price = ?, current_price = ?, end_time = ?, image_url = ?
        WHERE id = ?
    `;
    const [result] = await db.execute(query, [
        name,
        description,
        starting_price,
        current_price,
        end_time,
        image_url,
        id
    ]);
    return result.affectedRows > 0;
};

// Function to delete an auction by ID
const deleteAuction = async (id) => {
    const query = `DELETE FROM auctions WHERE id = ?`;
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
};

// Export the functions
export {
    createAuctionsTable,
    createAuction,
    getAuctionById,
    updateAuction,
    deleteAuction
};
