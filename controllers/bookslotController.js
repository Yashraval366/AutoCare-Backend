const asyncHandler = require('express-async-handler');
const mysqlConnection = require('../config/dbconnection');

const setBookslotData = asyncHandler(async (req, res) => {
    let connection = await mysqlConnection.getConnection()
    try{
        const {garage_id, garage_name, name, number, date, time, service} = req.body;
        console.log(garage_id, garage_name, name, number, date, time, service)
        

        if(!garage_id || !garage_name || !name || !number || !date || !time || !service){
            return res.json({message: "all fields are mandatory"})
        }

        const formattedDate = new Date(date).toISOString().split("T")[0];

        const bookingslot = await connection.execute(
            `insert into bookslots(garage_id, garage_name, name, number, date, time, service)
            values(?, ?, ?, ?, ?, ?,?)`, [garage_id, garage_name, name, number, formattedDate, time, service]
        )

        res.json({message: 'booked slot successfully', bookingId: bookingslot.insertId})
    } catch(err) {
        res.json({Error : err})
    } finally {
        connection.release();
    }
})

const getBookslotsData = asyncHandler(async (req, res) => {
    const connection = await mysqlConnection.getConnection();
    
    try {   
        const [garageData] = await connection.execute(
            `SELECT garage_id FROM bookslots WHERE bookslot_id = ?`, [req.user.id]
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
})


module.exports = {setBookslotData, getBookslotsData}