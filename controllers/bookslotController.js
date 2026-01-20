const asyncHandler = require('express-async-handler');
const mysqlConnection = require('../config/dbconnection');

const setBookslotData = asyncHandler(async (req, res) => {
    let connection;

    try {
        connection = await mysqlConnection.getConnection();

        const user_id = req.user.id;
        const { garage_id, garage_name, name, email, date, time, service } = req.body;

        console.log("Received Request Body:", req.body);
        console.log("User Object:", req.user);

        if (!garage_id || !garage_name || !name || !email || !date || !time || !service) {
            return res.status(400).json({ message: "All fields are mandatory" });
        }

        const formattedDate = new Date(date).toISOString().split("T")[0];

        const [queueCount] = await connection.execute(
            `SELECT COUNT(*) AS count FROM bookslots WHERE garage_id = ? AND date = ?`,
            [garage_id, formattedDate]
        );
        const queue_position = (queueCount[0].count || 0) + 1;

        console.log("Queue Position:", queue_position);

        const [existingBooking] = await connection.execute(
            `SELECT * FROM bookslots WHERE garage_id = ? AND date = ? AND time = ?`,
            [garage_id, formattedDate, time]
        );

        if (existingBooking.length > 0) {
            return res.status(400).json({ message: "Already booked!" });
        }

        const [bookingslot] = await connection.execute(
            `INSERT INTO bookslots (garage_id, garage_name, user_id, name, email, date, time, service, queue_position) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,

            [garage_id, garage_name, user_id, name, email, formattedDate, time, service, queue_position]
        );

        res.json({ message: "Booked slot successfully", bookingId: bookingslot.insertId });

    } catch (err) {
        console.error("Error in setBookslotData:", err);
        res.status(500).json({ error: err.message || "Internal Server Error" });
    } finally {
        if (connection) connection.release();
    }
});

const getBookslotsData = asyncHandler(async (req, res) => {
    const connection = await mysqlConnection.getConnection();
    
    try {   
        const [garageData] = await connection.execute(
            `SELECT garage_id FROM bookslots WHERE garage_id = ?`, [req.user.id]
        )

        if (garageData.length === 0) {
            return res.status(404).json({ message: "Garage not found for this owner" });
        }

        const garage_id = garageData[0].garage_id;

        const [bookslotsData] = await connection.execute(
            `SELECT * FROM bookslots WHERE garage_id = ?`, [garage_id]
        );

        if (bookslotsData.length === 0) {
            return res.status(404).json({ message: "No booking slots found for this garage" });
        }
        
        res.json({ garage_id, bookings: bookslotsData });
        
    } catch (err) {
        console.log([req.user.id])
        console.error("Database Error:", err);
        res.status(500).json({ message: "Database Error", error: err.message });
    } finally {
        connection.release()
    }
});

const updateBookingStatus = asyncHandler(async (req, res) => {
    let connection = await mysqlConnection.getConnection();

    try {
        const { bookslot_id, status } = req.body;

        if (!bookslot_id || !status) {
            return res.status(400).json({ message: "Booking ID and status are required" });
        }


        const validStatuses = ["Pending", "Completed", "Cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const [existingBooking] = await connection.execute(
            `SELECT * FROM bookslots WHERE bookslot_id = ?`,
            [bookslot_id]
        );

        if (existingBooking.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }


        await connection.execute(
            `UPDATE bookslots SET status = ? WHERE bookslot_id = ?`,
            [status, bookslot_id]
        );


        const [updatedBooking] = await connection.execute(
            `SELECT * FROM bookslots WHERE bookslot_id = ?`,
            [bookslot_id]
        );

        res.json({
            message: "Booking status updated successfully",
            booking: updatedBooking[0],
        });

    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ message: "Database Error", error: err.message });
    } finally {
        connection.release();
    }
});


const autoCancelExpiredBookings = async () => {
    let connection = await mysqlConnection.getConnection();
    
    try {
        const today = new Date().toISOString().split('T')[0]; 

        const [result] = await connection.execute(
            `UPDATE bookslots SET status = 'Cancelled' 
            WHERE date = ? AND status = 'Pending'`,
            [today]
        );

        console.log(`Auto-cancelled ${result.affectedRows} expired bookings.`);
    } catch (err) {
        console.error("Error in auto-cancel function:", err);
    } finally {
        connection.release();
    }
};


module.exports = {setBookslotData, getBookslotsData, updateBookingStatus, autoCancelExpiredBookings}