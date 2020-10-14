const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
	name: {
		type: Object,
		required: [true],
		unique: true,
	},
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
