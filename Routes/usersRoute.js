const express = require('express')
const { RegisterUser, sayhello, loginUser, checkAuth } = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()

router.route("/register").post(RegisterUser)
router.route("/login").post(loginUser)
router.route("/check-auth", authMiddleware).get(checkAuth)
router.route("/sayhello").get(sayhello)

module.exports = router;