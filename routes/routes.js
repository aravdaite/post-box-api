const express = require('express');
const {
	subscribeUser,
	unsubscribeUser,
	sendNotification,
	sendPicture,
	sampleGet,
} = require('../controllers/subscription');

const router = express.Router();

router.post('/subscribe', subscribeUser);
router.post('/unsubscribe', unsubscribeUser);
router.post('/sendNotification', sendNotification);
router.post('/sendPicture', sendPicture);
router.get('/get', sampleGet);

module.exports = router;
