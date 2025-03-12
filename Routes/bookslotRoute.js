const express = require('express')
const setBookslotData = require('../controllers/bookslotController')
const router = express.Router()

router.route("/setbookslot").post(setBookslotData)

module.exports = router;