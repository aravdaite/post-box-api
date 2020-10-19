const express = require('express');
const http = require('http');
const errorHandler = require('./middleware/error');
const cors = require('cors');
const routes = require('./routes/routes');
const connectDB = require('./config/db');
const webpush = require('web-push');
// const vapidKeys = webpush.generateVAPIDKeys();

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

const app = express();
app.use(express.json());

//connect to database
connectDB();

app.use(cors());
app.options('*', cors());

//mount routes
app.use('/api', routes);
const subLocal = {
	endpoint:
		'https://fcm.googleapis.com/fcm/send/egnY8zm3_sw:APA91bF2FTnz-Mq8Rd_2KizYjqWaWgKUGby3llcbFMtYfb1HFA2FkLgfV4K4wccNxdjITDyYCRswqSKiUwMhUN38xPCn2DaR_1tilTr622BLIfmvYSDPOFK9QZ8dVQ03znPBXJwVsslz',
	expirationTime: null,
	keys: {
		p256dh:
			'BBIZY-MU_eIdgCiaRTYHjQrGfyBDrZ0QU-xeozxofcwbC3QAsRRmlhP2765V1A-zWMFJEVcniD-ZLreDr73AIrw',
		auth: 'JV_7LUF9Saixt-az9Zk1LQ',
	},
};
app.post('/api/push', (req, res) => {
	//	return getSubscriptionsFromDatabase()
	//		.then((subscriptions) => {
	let promiseChain = Promise.resolve();
	//for (let i = 0; i < subscriptions.length; i++) {
	//		const subscription = subscriptions[i];
	promiseChain = promiseChain.then(() => {
		triggerPush(subLocal, 'dataToSend');
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
const PORT = process.env.PORT || 5000;
const server = http.Server(app);

server.listen(
	PORT,
	console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);

// handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`);
	// close server and exit process
	server.close(() => process.exit(1));
});

// handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`);
	// close server and exit process
	server.close(() => process.exit(1));
});
