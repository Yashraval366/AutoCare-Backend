const express = require('express')
const {setBookslotData, getBookslotsData} = require('../controllers/bookslotController')
const { authGarageOwner } = require('../middleware/authMiddleware')
const router = express.Router()

router.route("/setbookslot").post(setBookslotData)
router.route("/getbookslot").get(authGarageOwner, getBookslotsData)

module.exports = router;