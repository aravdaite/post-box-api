const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true],
		unique: false,
	},
	password: {
		type: String,
		required: [true],
		unique: false,
	},
	subscription: {
		type: Object,
		required: [true],
		unique: false,
	},
});

module.exports = mongoose.model('User', UserSchema);
