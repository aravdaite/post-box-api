const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/error');
const cors = require('cors');
const routes = require('./routes/routes');
const connectDB = require('./config/db');
const webpush = require('web-push');

// load env vars
dotenv.config({ path: './config/config.env' });
const app = express();
app.use(express.json());
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
//connect to database
connectDB();

app.use(cors());
app.options('*', cors());

//mount routes
app.use('/api', routes);

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
const subLocal = {
	endpoint:
		'https://fcm.googleapis.com/fcm/send/cDn_S_6nJaU:APA91bGeKKHMP9BtK1rCgZ6Fol-jvULY6XD3SZiEmO4ur4owV-eBGsM18GcqAW4gfHJAPLtcDPxbT3tbtMx6__DnidOo6pDNo9IDDcZqpAV-_uUvqWGrIlk99H60k7UlsKeBHHa3rtld',
	expirationTime: null,
	keys: {
		p256dh:
			'BKfwd4duWakCx2KILcZYAHw5f44qkqoveDB0txrdLhIV9Ec41E_uiSWVgkms-msej7MLizMI4PJM4ir-pagsOaM',
		auth: 'T1mI4NhnEKB1tXJnnBDdMg',
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
