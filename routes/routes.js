const express = require('express');
const {
	subscribeUser,
	unsubscribeUser,
	sendNotification,
} = require('../controllers/subscription');

const router = express.Router();

router.post('/subscribe', subscribeUser);
router.post('/unsubscribe', unsubscribeUser);
router.post('/sendNotification', sendNotification);

module.exports = router;
