const mysql2 = require('mysql2')

let mysqlConnection = mysql2.createPool({
    host: "localhost",
    user: "root",
    password: "yash7575@720",
    database: "newprojectdb",
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0
}).promise();


module.exports = mysqlConnection;