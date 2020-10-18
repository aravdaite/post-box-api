const express = require('express');
const {
	subscribeUser,
	unsubscribeUser,
} = require('../controllers/subscription');

const router = express.Router();

router.post('/subscribe', subscribeUser);
router.post('/unsubscribe', unsubscribeUser);

module.exports = router;
