const mysql2 = require('mysql2')

let mysqlConnection = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "yash7575@720",
    database: "newprojectdb"
})

mysqlConnection.connect((err) => {
    if(err){
        console.log("Error in DB connection"+JSON.stringify(err,undefined,2));
    }
    else{
        console.log("DB Connected Successfully");
    }
})

module.exports = mysqlConnection;