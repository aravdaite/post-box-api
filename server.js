const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const Subscription = require('./models/Subscription');

const errorHandler = require('./middleware/error');
const cors = require('cors');

const sub_local = {
	endpoint:
		'https://fcm.googleapis.com/fcm/send/eUbNoCS2lOI:APA91bFVBAxK2pIaiKBgh3sUbiSg4cJ2u1dfco825xbb4uQKQu-Kll_KY7qdfQu7uVNonCIuIh_UiyRiAyEQ75gXv5hxzJtCeMHtHb35LxDH89n1VuZRh5IglgH0xVu8lxsqtQn3MHXu',
	expirationTime: null,
	keys: {
		p256dh:
			'BHM7hUmjKNH9vBDHxCCsSIjkwYhJtErQyLkM4JwHxNCJoDGUIObFOBeQPKKELxumpY0rq9YSQJW_cP7orl85SZI',
		auth: 'mCoFA8PHoUKu2cvGz0UM6A',
	},
};
const sub_heroku = {
	endpoint:
		'https://fcm.googleapis.com/fcm/send/edF1nKo1co8:APA91bETlMQzlHQXaBNUUoX8bVmctUhxSrVNulup8ZM0fxpECVaCmD5CWejfv4v_1IqS2pKlRHPXFkUPXB4NMgROv0mVKFyXV-3JgF_8_v2luTFfclezaxCK1VBgWAkV7ETVXPDEle45',
	expirationTime: null,
	keys: {
		p256dh:
			'BB4PdmX8xSzgc_5_nmY2w_PZCfyid897Y0wrB7KIzwvNSBGzwMiYdoPHJyF29bVjiDZC6eP9a1_yikVEjtmfhec',
		auth: 'Ej-2KU1qDYufRwaJV9ri6Q',
	},
};
// load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

app.use(express.json());
let allowCrossDomain = function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', '*');
	next();
};
app.use(allowCrossDomain);

const webpush = require('web-push');
//const vapidKeys = webpush.generateVAPIDKeys();
//console.log(vapidKeys);
webpush.setGCMAPIKey(
	'AAAAGHNiu6M:APA91bG41qft5Ty7dsr37UMqQi3HbgdDNynsnJkk_nKn-_GCSlqy6BpMNyCtd1NzQWtutiu87HV2j-sVmWiXZpCliJjlhHENP0trETnsITEKi_Uu8yrniUxO6FXTLRW6M-5JHgPxI7ep'
);
const vapidKeys = {
	publicKey:
		'BBQjP3Ldy8KgALXkursQaSYB6XcIE-cvO_Qz3mADr32iCbtc5yEEh99CwDJ2-_cWO9uHqAItQbXXaPsqgtbpMc4',
	privateKey: 'I5fFueaJBgfwXk2MR2Jei99I7To01r__l54kJyCTP6Y',
};
webpush.setVapidDetails(
	'mailto:myego0@gmail.com',
	vapidKeys.publicKey,
	vapidKeys.privateKey
);
console.log(vapidKeys.publicKey, vapidKeys.privateKey);

const isValidSaveRequest = (req, res) => {
	if (!req.body || !req.body.endpoint) {
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

const saveSubscriptionToDatabase = (subscription) => {
	return new Promise((resolve, reject) => {
		insertToDatabase(subscription, (err, id) => {
			if (err) {
				reject(err);
				return;
			}

			resolve(id);
		});
	});
};

// mount routes
app.post('/api/subscription', (req, res) => {
	console.log('got subscription', req.body);
	if (!isValidSaveRequest(req, res)) {
		return;
	}
	Subscription.create({
		name: req.body,
	});
	res.send(
		JSON.stringify({
			error: {
				id: 'unable-to-send-messages',
				message: `Failed to send the push `,
			},
		})
	);
});
const triggerPush = (subscription, dataToSend) => {
	return webpush.sendNotification(subscription, dataToSend).catch((err) => {
		if (err.statusCode === 410) {
			console.log(err);
			//return deleteSubscriptionFromDatabase(subscription._id);
		} else {
			console.log('Subscription is no longer valid: ', err);
		}
	});
};
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
const getSubscriptionsFromDatabase = () => {
	const sub = {
		endpoint:
			'https://fcm.googleapis.com/fcm/send/cyKAmk4eSAk:APA91bFQhmY3KOWWwof6tmIanpGKjDd3MWpLLDs6WowSLxspTxjdJubGp4Nex4Qfi5J_1bZx4SyLPg7fsnwX8MIQcoWH0hhNIkQIHizukrP3v_kZII11MSBO-KvJPRxcYvGqP9sd5SN_',
		expirationTime: null,
		keys: {
			p256dh:
				'BALYG4l1PvgDrJeDeSllBJ-iH_WLPCCD1GQWm_Jihrc77GkDxwLT12gbhPaNaJawFQwZOgrarrfT4wLP1bjX-70',
			auth: 'fn9OvLA3Hhmwe5b2gONnUA',
		},
	};
	return sub;
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
