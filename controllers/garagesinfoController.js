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

module.exports = getGaragesInfo