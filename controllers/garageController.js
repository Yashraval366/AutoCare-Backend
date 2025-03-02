const asyncHandler = require('express-async-handler')
const mysqlConnection = require('../config/dbconnection')

const getGarageuser = asyncHandler(async (req, res) => {
    res.status(200).json({message: "this is for getting all garageuser from db"})
})

module.exports = getGarageuser;