const express = require('express');
const {
	subscribeUser,
	unsubscribeUser,
	sendNotification,
	sendPicture,
} = require('../controllers/subscription');

const router = express.Router();

router.post('/subscribe', subscribeUser);
router.post('/unsubscribe', unsubscribeUser);
router.post('/sendNotification', sendNotification);
router.put('/sendPicture', sendPicture);

module.exports = router;
