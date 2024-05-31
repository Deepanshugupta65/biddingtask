
import mysql from 'mysql2/promise';



const db = async () => {
  try {
    await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    console.log('Connected to the MySQL database.');
  } catch (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1); // Exit process with failure
  }
};
export default db;

// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';

// dotenv.config();

// let db;

// const connectDB = async () => {
//   try {
//     db = await mysql.createConnection({
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//       port: process.env.DB_PORT
//     });
//     console.log('Connected to the MySQL database.');
//   } catch (err) {
//     console.error('Error connecting to the database:', err);
//     process.exit(1); // Exit process with failure
//   }
// };

// connectDB();
// export default db;
