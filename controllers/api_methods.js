const asyncHandler = require('../middleware/async');
const CurrencyRate = require('../models/CurrencyRate');
const Currency = require('../models/Currency');
const UserActivity = require('../models/UserActivity');
const { updateCurrencyList, updateCurrencyRates } = require('./updateDatabase');

exports.getRate = asyncHandler(async (req, res) => {
	await updateCurrencyList();
	await updateCurrencyRates();
	const { currency } = req.params;
	const dataFromDb = await CurrencyRate.findOne({ currency });
	const { factor } = dataFromDb;
	res.status(200).json({
		response: factor,
	});
});

exports.getAvailableCurrencies = asyncHandler(async (req, res) => {
	//await updateCurrencyList();
	//await updateCurrencyRates();
	const availableCurrencies = await CurrencyRate.find({});
	const allCurrencies = await Currency.find({});
	let listCurrencies = [];
	availableCurrencies.map((elem1) => {
		allCurrencies.map((elem2) => {
			if (elem1.currency === elem2.name) {
				const listItem = {};
				listItem.id = elem2.name;
				listItem.lt = elem2.lt;
				listItem.en = elem2.en;
				listItem.factor = elem1.factor;
				listCurrencies.push(listItem);
			}
		});
	});
	listCurrencies = listCurrencies.sort(compare);
	res.status(200).json({
		response: listCurrencies,
	});
});
exports.logActivity = asyncHandler(async (req, res) => {
	const { currencies, amount, rate } = req.body;
	const date = new Date();

	await UserActivity.create({
		date,
		currencies,
		amount,
		rate,
	});
	res.status(204);
});
function compare(a, b) {
	const currA = a.id.toUpperCase();
	const currB = b.id.toUpperCase();

	let comparison = 0;
	if (currA > currB) {
		comparison = 1;
	} else if (currA < currB) {
		comparison = -1;
	}
	return comparison;
}
exports.subFunc = asyncHandler(async (req, res) => {
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
});
