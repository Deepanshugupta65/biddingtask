// index.js
import db from './db/config.js'
import dotenv from 'dotenv';
import {app} from './app.js'

dotenv.config(
    {
        path:'./env'
    }
);

db()
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
