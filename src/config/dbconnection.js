const mysql2 = require('mysql2')
require('dotenv').config();

let mysqlConnection = mysql2.createPool({
    host: process.env.DB_HOST_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0,
    ssl: {
    rejectUnauthorized: false, 
  },
}).promise();


module.exports = mysqlConnection;