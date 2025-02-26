const express = require('express')
const { RegisterUser, sayhello } = require('../controllers/userController')
const router = express.Router()

router.route("/register").post(RegisterUser)
router.route("/sayhello").get(sayhello)

module.exports = router;