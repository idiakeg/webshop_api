const errHandler = (err, req, res, next) => {
	if (err.name === "UnauthorizedError") {
		return res.status(401).json({
			success: false,
			message: "Unauthorized access!!",
		});
	}

	res.status(500).json({
		success: false,
		message: err,
	});
};

module.exports = errHandler;
