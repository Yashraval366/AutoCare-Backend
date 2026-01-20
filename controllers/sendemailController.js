const asyncHandler = require('express-async-handler')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

const sendEmail = asyncHandler(async (req, res) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS
        }
    });

    const { userEmail, serviceDetails } = req.body; 

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail, // User's email
        subject: "Your Garage Service is Completed!",
        text: `Hello, your garage service request has been completed.\n\nDetails: ${serviceDetails}\n\nThank you for choosing us!`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
        console.error("Email sending error:", error);
        res.status(500).json({ success: false, message: "Failed to send email." });
    }
})

module.exports = sendEmail;