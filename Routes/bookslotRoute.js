const express = require('express')
const {setBookslotData, getBookslotsData} = require('../controllers/bookslotController')
const { authUsers } = require('../middleware/authMiddleware')
const router = express.Router()

router.route("/setbookslot").post(setBookslotData)
router.route("/getbookslot").get(authUsers, getBookslotsData)

module.exports = router;