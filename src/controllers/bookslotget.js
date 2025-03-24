const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const mysqlConnection = require('../config/dbconnection');

const getBookslotsData = asyncHandler(async (req, res) => {
    const connection = await mysqlConnection.getConnection();
    
    try {   
        const [bookslotsData] = await connection.execute(
            `SELECT * FROM bookslots WHERE garage_id = ?`, [req.user.id]
        )
        console.log(req.user.id)

        if(bookslotsData.length === 0){
            return res.status(404).json({message: "No bookslots was found for this owner"})
        }

        res.json({Garage : bookslotsData[0] })
        
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ message: "Database Error", error: err.message });
    } finally {
        connection.release()
    }
}) 


module.exports = getBookslotsData;