const express = require('express')
const { RegisterUser, sayhello, loginUser, checkAuth } = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()
const multer = require('multer')
const getUsersData = require('../controllers/userinfocontroller')
const authUsers = require('../middleware/authMiddleware')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.route("/register").post(upload.single("garage_image"), RegisterUser)

router.route("/login").post(loginUser)
router.route("/check-auth", authMiddleware).get(checkAuth)
router.route("/sayhello").get(sayhello)
router.route("/getusers").get(authUsers, getUsersData)

module.exports = router;