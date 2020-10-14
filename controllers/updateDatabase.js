const asyncHandler = require('../middleware/async');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var parseString = require('xml2js').parseString;
//const Currency = require('../models/Currency');
const CurrencyRate = require('../models/CurrencyRate');

const getCurrencyList =
	'https://www.lb.lt/webservices/FxRates/FxRates.asmx/getCurrencyList';
const getCurrentFxRates =
	'https://www.lb.lt/webservices/FxRates/FxRates.asmx/getCurrentFxRates?tp=EU';
exports.updateCurrencyList = asyncHandler(async (req, res) => {
	const Http = new XMLHttpRequest();
	await Http.open('get', getCurrencyList);
	await Http.send();
	Http.onreadystatechange = asyncHandler(async (e) => {
		if (Http.readyState === 4) {
			if (Http.status === 200) {
				await parseString(Http.responseText, updateDatabase);
			}
		}
	});
});

exports.updateCurrencyRates = asyncHandler(async (req, res) => {
	const Http = new XMLHttpRequest();
	await Http.open('get', getCurrentFxRates);
	await Http.send();
	Http.onreadystatechange = asyncHandler(async (e) => {
		if (Http.readyState === 4) {
			if (Http.status === 200) {
				await parseString(Http.responseText, updateRates);
			}
		}
	});
});

updateDatabase = asyncHandler(async (err, result) => {
	result.CcyTbl.CcyNtry.map(
		asyncHandler(async (elem) => {
			const fieldsToUpdate = {
				lt: elem.CcyNm[0]._,
				en: elem.CcyNm[1]._,
			};

			//if currency exists, update
			const currency = await Currency.findOneAndUpdate(
				{ name: elem.Ccy[0] },
				fieldsToUpdate,
				{
					new: true,
					runValidators: true,
				}
			);
			//if currency doesn't exist, create
			if (!currency) {
				const currency = await Currency.create({
					name: elem.Ccy[0],
					lt: elem.CcyNm[0]._,
					en: elem.CcyNm[1]._,
				});
			}
		})
	);
});
updateRates = asyncHandler(async (err, result) => {
	result.FxRates.FxRate.map(
		asyncHandler(async (elem) => {
			const fieldsToUpdate = {
				factor: elem.CcyAmt[1].Amt[0],
			};

			//if currency exists, update
			const currencyRate = await CurrencyRate.findOneAndUpdate(
				{ currency: elem.CcyAmt[1].Ccy[0] },
				fieldsToUpdate,
				{
					new: true,
					runValidators: true,
				}
			);
			//if currency doesn't exist, create
			if (!currencyRate) {
				const currencyRate = await CurrencyRate.create({
					currency: elem.CcyAmt[1].Ccy[0],
					factor: elem.CcyAmt[1].Amt[0],
				});
			}
		})
	);
});
