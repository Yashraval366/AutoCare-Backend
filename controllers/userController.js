const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const moment = require('moment');
const mysqlConnection = require('../config/dbconnection');

const RegisterUser = asyncHandler(async (req, res) => {
    const { role, username, email, password, phone, dob, gender, city } = req.body;

    if( !role || !username || !email || !password || !phone || !dob || !gender || !city ) {
            res.status(400)
            throw new Error("All fields are mandatory");
        }
    
    const hashpassword = await bcrypt.hash(password, 10);

    const formattedDOB = moment(dob, ["DD-MM-YYYY", "MM-DD-YYYY"]).format("YYYY-MM-DD");

    const sql = `insert into usertable (role, username, email, password, phone, date_of_birth, gender, city) values (?, ?, ?, ?, ?, ?, ?, ?)`
    
    mysqlConnection.query(sql, [role, username, email, hashpassword, phone, formattedDOB, gender, city], (err, result) => {
        if(err) {
            if(err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message:'Username, email, or phone number already exists'})
            }
             return res.status(500).json({message : 'Database Error', error : err});
        }
        res.status(201).json({ message: 'User registered successfully' });
    })
})

const sayhello = asyncHandler(async (req, res) => {
    res.status(200).json({message: "hello the route is working"});
})

module.exports = { RegisterUser, sayhello }