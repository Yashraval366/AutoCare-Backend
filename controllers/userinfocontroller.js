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

const updateuserInfo = asyncHandler(async (req, res) => {
    let connection;
    try {
        connection = await mysqlConnection.getConnection(); 

        const { name, city, phone, email } = req.body;

        console.log("Updating user:", name, city, phone, email);

        const sql = `
            UPDATE users 
            SET name = ?, 
                city = ?, 
                phone = ?, 
                email = ?, 
            WHERE id = ?
        `;

        const [updateUser] = await connection.execute(sql, [
            name, city, phone, email, req.user.id
        ]);

        if (updateUser.affectedRows === 0) {
            return res.status(404).json({ message: "Garage not found or no changes made" });
        }

        res.json({ message: "User data updated successfully" });

    } catch (err) {
        console.error("Update Uder Error:", err);
        res.status(500).json({ message: "Something went wrong updating data", error: err.message });
    } finally {
        if (connection) connection.release(); 
    }
});


const getUsersHistory = asyncHandler(async (req, res) => {
    const connection = await mysqlConnection.getConnection();
    
    try {   
        const [usersHist] = await connection.execute(
            `SELECT * FROM bookslots WHERE user_id = ?`, [req.user.id]
        )

        if(usersHist.length === 0){
            return res.status(404).json({message: "No users was found for this"})
        }

        res.json({PrevData : usersHist[0] })
        
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ message: "Database Error", error: err.message });
    } finally {
        connection.release()
    }
}) 


module.exports = {getUsersData, updateuserInfo, getUsersHistory};