const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
	data: {
		type: Object,
		required: [true],
		unique: false,
	},
});

module.exports = mongoose.model('Income', IncomeSchema);
