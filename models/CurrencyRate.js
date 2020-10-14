const mongoose = require('mongoose');

const CurrencyRateSchema = new mongoose.Schema({
	currency: {
		type: String,
		required: [true],
		unique: true,
	},
	factor: {
		type: Number,
		required: [true],
		unique: false,
	},
});

module.exports = mongoose.model('CurrencyRate', CurrencyRateSchema);
