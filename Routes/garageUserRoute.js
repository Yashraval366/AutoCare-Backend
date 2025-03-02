const express = require('express')
const getGarageuser = require('../controllers/garageController')
const router = express.Router()

router.route("/garageuser").get(getGarageuser)

module.exports = router;