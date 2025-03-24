const express = require('express')
const getGarageData = require('../controllers/garageownerController')
const { authGarageOwner } = require('../middleware/authMiddleware')
const router = express.Router()

router.route("/garagedata").get(authGarageOwner, getGarageData);


module.exports = router;