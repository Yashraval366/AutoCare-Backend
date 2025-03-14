const express = require('express')
const {setBookslotData, getBookslotsData, updateBookingStatus, cancelBooking} = require('../controllers/bookslotController')
const { authGarageOwner } = require('../middleware/authMiddleware')
const router = express.Router()

router.route("/setbookslot").post(setBookslotData)
router.route("/getbookslot").get(authGarageOwner, getBookslotsData)
router.route("/updatestatus").post(updateBookingStatus)


module.exports = router;