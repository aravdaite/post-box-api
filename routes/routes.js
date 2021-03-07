const express = require('express');
const {
	sendPicture
} = require('../controllers/subscription');

const router = express.Router();


router.post('/sendPicture', sendPicture);
router.get('/get', sampleGet);

module.exports = router;
