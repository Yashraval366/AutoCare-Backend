const express = require('express')
const multer = require('multer')
const {getGaragesInfo, updategarageInfo, getGaragesBySearch} = require('../controllers/garagesinfoController');
const { authGarageOwner } = require('../middleware/authMiddleware');
const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.route("/garagesinfo").get(getGaragesInfo);
router.route("/updategarage").put(authGarageOwner, upload.single("garage_image"), updategarageInfo)
router.route("/searchgarage").get(upload.single("garage_image"), getGaragesBySearch)


module.exports = router;