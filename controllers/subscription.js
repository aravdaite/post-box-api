const dotenv = require('dotenv');
const asyncHandler = require('../middleware/async');

// @desc      Send picture from the camera/hardware to the server
// @route     PUT /api/sendPicture
// @access    Public
exports.sendPicture = asyncHandler(async (req, res) => {
	console.log('sendPicture', req.body);
	// if subscription exists, do nothing

	res.status(200).json({
		success: true,
	});
});

