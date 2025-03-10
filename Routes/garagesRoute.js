const express = require('express')
const getGaragesInfo = require('../controllers/garagesinfoController');
const router = express.Router()

router.route("/garagesinfo").get(getGaragesInfo);


module.exports = router;