const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const mysqlConnection = require('../config/dbconnection');

const getGarageData = asyncHandler(async (req, res) => {
    const connection = await mysqlConnection.getConnection();
    
    try {   
        const [garageData] = await connection.execute(
            `SELECT * FROM garages WHERE owner_id = ?`, [req.user.id]
        )

        if(garageData.length === 0){
            return res.status(404).json({message: "No Garage was found for this owner"})
        }

        res.json({Garage : garageData[0] })
        
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ message: "Database Error", error: err.message });
    } finally {
        connection.release()
    }
}) 



module.exports = getGarageData;