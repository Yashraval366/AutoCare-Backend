const mysql2 = require('mysql2')

let mysqlConnection = mysql2.createPool({
    host: "localhost",
    user: "root",
    password: "#Sakshi13",
    database: "garagerfinder",
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0
}).promise();


module.exports = mysqlConnection;