const getBookslotData = require('../controllers/bookslotget')
const express = require('express')
const setBookslotData = require('../controllers/bookslotController')
const router = express.Router()

router.route("/setbookslot").post(setBookslotData)
router.route("/getbookslot").get(getBookslotData)

module.exports = router;