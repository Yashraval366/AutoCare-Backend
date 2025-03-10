const asyncHandler = require('express-async-handler')
const mysqlConnection = require('../config/dbconnection');

const getUsersData = asyncHandler(async (req, res) => {
    const connection = await mysqlConnection.getConnection();
    
    try {   
        const [usersData] = await connection.execute(
            `SELECT * FROM users WHERE id = ?`, [req.user.id]
        )

        if(usersData.length === 0){
            return res.status(404).json({message: "No users was found for this owner"})
        }

        res.json({User : usersData[0] })
        
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ message: "Database Error", error: err.message });
    } finally {
        connection.release()
    }
}) 


module.exports = getUsersData;