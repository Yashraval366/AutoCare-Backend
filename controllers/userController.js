const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const mysqlConnection = require('../config/dbconnection');

const RegisterUser = asyncHandler(async (req, res) => {
    const { role, username, email, password, phone, gender, city, garage_name, garage_location, garage_contact, garage_email } = req.body;
    
    const garageImage = req.file ? "/uploads/" + req.file.filename : null;

    console.log(role, username, email, password, phone, gender, city, garage_name, garage_location, garage_contact, garage_email, garageImage)

    if (!role || !username || !email || !password || !phone || !gender || !city) {
        return res.status(400).json({ message: "All fields are mandatory" });
    }

    const hashpassword = await bcrypt.hash(String(password), 10);
    let connection;

    try {

        connection = await mysqlConnection.getConnection();
        await connection.beginTransaction();

        const [existingUser] = await connection.execute(
            `SELECT id FROM users WHERE email = ? OR phone = ? OR username = ?`, 
            [email, phone, username]
        );

        if (existingUser.length > 0) {
            connection.release();
            return res.status(400).json({ message: "Username, email, or phone number already exists" });
        }

    
        const queryforuser = `INSERT INTO users (role, username, email, password, phone, gender, city) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [userResult] = await connection.execute(
            queryforuser, [role, username, email, hashpassword, phone, gender, city]
        );

        const userId = userResult.insertId; 

        if (role === "garageowner") {
            if (!garage_name || !garage_location || !garage_contact || !garage_email || !garageImage) {
                throw new Error("Garage details are required for a garage owner");
            }

            await connection.execute(
                `INSERT INTO garages (owner_id, garage_name, garage_location, garage_contact, garage_email, garage_image) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    userId, 
                    garage_name || null,
                    garage_location || null,
                    garage_contact || null, 
                    garage_email || null, 
                    garageImage|| null
                ] 
            );
        }

        await connection.commit();

        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {

        console.log(req.body)
        console.log(req.file); 
        if (connection) await connection.rollback(); 
        console.error("Database Error:", err);
        
        res.status(500).json({ message: "Database Error", error: err.message });
    } finally {
        if (connection) connection.release(); 
    }
});


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const sql = 'SELECT * FROM users WHERE email = ?';
    let connection;

    try {

        connection = await mysqlConnection.getConnection()

        const [rows] = await connection.execute(sql, [email]);

        const user = rows[0];
    
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const matchPassword = await bcrypt.compare(password, user.password)
        if (!matchPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

         const token = jwt.sign({ 
            id: user.id,
            role: user.role
         }, 
         process.env.SECRET_KEY, {
            expiresIn: '15m',
        });

        res.json({ message: "Login successful", token, role: user.role });

    } catch (err){
        console.log("Error In function : ", err)
    } finally {
        if (connection) connection.release();
    }
})

const checkAuth = asyncHandler(async (req, res) => {
    res.json({message: "token is valid", user: req.user })
})

const sayhello = asyncHandler(async (req, res) => {
    res.status(200).json({message: "hello the route is working"});
})

module.exports = { RegisterUser, loginUser, checkAuth ,sayhello }