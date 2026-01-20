const asyncHandler = require('express-async-handler')
const mysqlConnection = require('../config/dbconnection')

const getGaragesInfo = asyncHandler(async (req, res) => {
    const { city } = req.query; 
    const connection = await mysqlConnection.getConnection();

    try {
        let garagesQuery = `
            SELECT id AS garage_id, garage_name, garage_location, garage_contact, 
                   garage_email, garage_image, created_at 
            FROM garages
        `;
        const queryParams = [];

        if (city) {
            garagesQuery += " WHERE garage_location LIKE ?";
            queryParams.push(`%${city}%`); 
        }

        const [garagesInfo] = await connection.execute(garagesQuery, queryParams);

        if (garagesInfo.length === 0) {
            return res.status(404).json({ message: "No garages found for the selected city" });
        }

        const [queueData] = await connection.execute(
            `SELECT garage_id, COUNT(bookslot_id) AS queue_count 
             FROM bookslots 
             WHERE status = 'pending' AND date = CURDATE()  
             GROUP BY garage_id`
        );

        const queueMap = new Map(queueData.map(q => [q.garage_id, q.queue_count]));

        garagesInfo.forEach(garage => {
            garage.queue_count = queueMap.get(garage.garage_id) || 0;
        });

        res.json({ Garages: garagesInfo });

    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ message: "Database Error", error: err.message });
    } finally {
        connection.release();
    }
});


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
        if (connection) connection.release(); 
    }
});

const getGaragesBySearch = asyncHandler(async (req, res) => {
    const { search } = req.query; 
    const connection = await mysqlConnection.getConnection();

    try {
        let query = `
            SELECT id AS garage_id, garage_name, garage_location, garage_contact, 
                   garage_email, garage_image, created_at 
            FROM garages
        `;
        const queryParams = [];

        if (search) {
            query += " WHERE garage_name LIKE ? OR garage_location LIKE ?";
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        const [garagesInfo] = await connection.execute(query, queryParams);

        if (garagesInfo.length === 0) {
            return res.status(404).json({ message: "No garages found for the search term" });
        }

        const [queueData] = await connection.execute(
            `SELECT garage_id, COUNT(bookslot_id) AS queue_count 
             FROM bookslots 
             WHERE status = 'pending'  
             GROUP BY garage_id`
        );

        const queueMap = new Map(queueData.map(q => [q.garage_id, q.queue_count]));

        garagesInfo.forEach(garage => {
            garage.queue_count = queueMap.get(garage.garage_id) || 0;
        });

        res.json({ Garages: garagesInfo });

    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ message: "Database Error", error: err.message });
    } finally {
        connection.release();
    }
});

module.exports = {getGaragesInfo, updategarageInfo, getGaragesBySearch}