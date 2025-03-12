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

const getbookslot =


module.exports = setBookslotData;