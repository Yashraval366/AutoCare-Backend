const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
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

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const sql = 'SELECT * FROM usertable WHERE email = ?';

    mysqlConnection.query(sql, [email], async(err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];

        const matchPassword = await bcrypt.compare(password, user.password)
        if (!matchPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        //generating token
         const token = jwt.sign({ 
            user : {
                id: user.id,
                email: user.email, 
                username: user.username,
            }
         }, 
         process.env.SECRET_KEY, {
            expiresIn: '15m',
        });

        res.status(200).json({ token });
    })
})

const checkAuth = asyncHandler(async (req, res) => {
    res.json({message: "token is valid", user: req.user })
})

const sayhello = asyncHandler(async (req, res) => {
    res.status(200).json({message: "hello the route is working"});
})

module.exports = { RegisterUser, loginUser, checkAuth ,sayhello }