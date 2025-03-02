const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const mysqlConnection = require('../config/dbconnection');

const RegisterUser = asyncHandler(async (req, res) => {
    const { role, username, email, password, phone, gender, city, garage_name, garage_location, garage_contact, garage_email } = req.body;
    const garageImage = req.file ? "/uploads/" + req.file.filename : null;

    // Check if all required fields are present
    if (!role || !username || !email || !password || !phone || !gender || !city) {
        return res.status(400).json({ message: "All fields are mandatory" });
    }

    // Hash the password before storing it
    const hashpassword = await bcrypt.hash(String(password), 10);
    let connection;

    try {
        // Start a database transaction
        connection = await mysqlConnection.getConnection();
        await connection.beginTransaction();

        // Check if the username, email, or phone already exists
        const [existingUser] = await connection.execute(
            `SELECT id FROM users WHERE email = ? OR phone = ? OR username = ?`, 
            [email, phone, username]
        );

        if (existingUser.length > 0) {
            connection.release();
            return res.status(400).json({ message: "Username, email, or phone number already exists" });
        }

        // Insert the user into the database
        const queryforuser = `INSERT INTO users (role, username, email, password, phone, gender, city) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [userResult] = await connection.execute(
            queryforuser, [role, username, email, hashpassword, phone, gender, city]
        );

        const userId = userResult.insertId; // Get the inserted user's ID

        // If the user is a garage owner, insert garage information as well
        if (role === "garageowner") {
            if (!garage_name || !garage_location || !garage_contact || !garage_email || !garageImage) {
                throw new Error("Garage details are required for a garage owner");
            }

            // Insert garage information into the 'garages' table
            await connection.execute(
                `INSERT INTO garages (owner_id, garage_name, garage_location, garage_contact, garage_email, garage_image) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [userId, garage_name, garage_location, garage_contact, garage_email, garageImage] // Correctly mapped field names
            );
        }

        // Commit the transaction
        await connection.commit();

        // Respond to the client that registration was successful
        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        // Rollback if there was an error
        console.log(req.body); // Log the request body for debugging
        console.log(req.file); // Log the uploaded file for debugging
        if (connection) await connection.rollback(); 
        console.error("Database Error:", err);
        
        // Return error response
        res.status(500).json({ message: "Database Error", error: err.message });
    } finally {
        if (connection) connection.release(); // Release the database connection
    }
});



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