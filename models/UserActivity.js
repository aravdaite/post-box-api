const mongoose = require('mongoose');

const UserActivitySchema = new mongoose.Schema({
	date: {
		type: String,
		required: [true],
		unique: true,
	},
	currencies: {
		type: String,
		required: [true],
		unique: false,
	},
	amount: {
		type: String,
		required: [true],
		unique: false,
	},
	rate: {
		type: String,
		required: [true],
		unique: false,
	},
});

module.exports = mongoose.model('UserActivity', UserActivitySchema);
