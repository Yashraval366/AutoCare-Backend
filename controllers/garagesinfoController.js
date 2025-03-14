const asyncHandler = require('express-async-handler')
const mysqlConnection = require('../config/dbconnection')

const getGaragesInfo = asyncHandler(async (req, res) => {
     
    const connection = await mysqlConnection.getConnection()

    try{
        const [garagesInfo] = await connection.execute(
            `SELECT * FROM garages`
        )

        if(garagesInfo.length === 0){
            return res.status(404).json({message: "No Garage was found in your city"})
        }

        res.json({Garages: garagesInfo})

    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ message: "Database Error", error: err.message });
    } finally {
        connection.release()
    }

})


const updategarageInfo = asyncHandler(async (req, res) => {
    let connection;
    try {
        connection = await mysqlConnection.getConnection(); // Get connection

        const { name, location, contact, email } = req.body;
        const garageImage = req.file ? `/uploads/${req.file.filename}` : null;

        console.log("Updating Garage:", name, location, contact, email, garageImage);

        const sql = `
            UPDATE garages 
            SET garage_name = ?, 
                garage_location = ?, 
                garage_contact = ?, 
                garage_email = ?, 
                garage_image = COALESCE(?, garage_image) 
            WHERE id = ?
        `;

        const [updateGarage] = await connection.execute(sql, [
            name, location, contact, email, garageImage, req.user.id
        ]);

        if (updateGarage.affectedRows === 0) {
            return res.status(404).json({ message: "Garage not found or no changes made" });
        }

        res.json({ message: "Garage data updated successfully" });

    } catch (err) {
        console.error("Update Garage Error:", err);
        res.status(500).json({ message: "Something went wrong updating data", error: err.message });
    } finally {
        if (connection) connection.release(); // Ensure connection is released
    }
});

module.exports = {getGaragesInfo, updategarageInfo}