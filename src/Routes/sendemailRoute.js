const express = require('express')
const nodemailer = require("nodemailer");
const sendEmail = require('../controllers/sendemailController')
const router = express.Router()
const dotenv = require('dotenv')
dotenv.config()


router.route("/sendemail").post(sendEmail)

module.exports = router;