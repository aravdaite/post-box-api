const webpush = require('web-push');
const dotenv = require('dotenv');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
// load env vars
dotenv.config({ path: './config/config.env' });
// const vapidKeys = webpush.generateVAPIDKeys();
// console.log(vapidKeys);
webpush.setGCMAPIKey(process.env.GCMAPI_KEY);
const vapidKeys = {
	publicKey: process.env.PUBLIC_KEY,
	privateKey: process.env.PRIVATE_KEY,
};
webpush.setVapidDetails(
	'mailto:myego0@gmail.com',
	vapidKeys.publicKey,
	vapidKeys.privateKey
);

const isValidSaveRequest = (req, res) => {
	if (!req.body || !req.body.subscription.endpoint) {
		res.status(400);
		res.setHeader('Content-Type', 'application/json');
		res.send(
			JSON.stringify({
				error: {
					id: 'no-endpoint',
					message: 'Subscription must have an endpoint',
				},
			})
		);
		return false;
	}
	return true;
};

// @desc      Get user's subscription data and save it in the database
// @route     POST /api/subscribe
// @access    Public
exports.subscribeUser = asyncHandler(async (req, res) => {
	if (!isValidSaveRequest(req, res)) {
		return;
	}
	// if subscription exists, do nothing
	let foundUser = await User.findOne({
		subscription: req.body.subscription,
	});
	if (!foundUser) {
		foundUser = await User.create({
			name: req.body.name,
			password: req.body.password,
			subscription: req.body.subscription,
		});
	}
	let promiseChain = Promise.resolve();
	promiseChain = promiseChain.then(() => {
		console.log('runs inside push', req.body.subscription);
		triggerPush(req.body.subscription, 'dataToSend');
	});
	res.status(200).json({
		success: true,
	});
});
// @desc      Delete user's subscription data from the database
// @route     POST /api/unsubscribe
// @access    Public
exports.unsubscribeUser = asyncHandler(async (req, res) => {
	console.log('runs here');
	// if subscription does not exists, do nothing
	await User.remove({
		subscription: req.body.subscription,
	});
	res.status(200).json({
		success: true,
	});
});

const triggerPush = (subscription, dataToSend) => {
	return webpush.sendNotification(subscription, dataToSend).catch((err) => {
		if (err.statusCode === 410) {
			console.log(err);
			// return deleteSubscriptionFromDatabase(subscription._id);
		} else {
			console.log('Subscription is no longer valid: ', err);
		}
	});
};
/*
app.post('/api/push', (req, res) => {
	//	return getSubscriptionsFromDatabase()
	//		.then((subscriptions) => {
	let promiseChain = Promise.resolve();
	//for (let i = 0; i < subscriptions.length; i++) {
	//		const subscription = subscriptions[i];
	promiseChain = promiseChain.then(() => {
		triggerPush(sub_local, 'dataToSend');
		triggerPush(sub_heroku, 'dataToSend');
	});
	//}

	//	})

	//.then(() => {
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify({ data: { success: true } }));
	//})
	//.catch((err) => {
	//	res.status(500);
	//	res.setHeader('Content-Type', 'application/json');
	//	res.send(
	//		JSON.stringify({
	//			error: {
	//				id: 'unable-to-send-messages',
	//				message: `Failed to send the push ${err.message}`,
	//			},
	//		})
	//	);
	//	});
});
*/
