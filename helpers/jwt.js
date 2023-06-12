const { expressjwt: expressJwt } = require("express-jwt");

// This module provides Express middleware for validating JWTs (JSON Web Tokens) through the jsonwebtoken module. The decoded JWT payload is available on the request object.

const authJwt = () => {
	const secret = process.env.SECRET;
	return expressJwt({
		secret,
		algorithms: ["HS256"],
	});
};

module.exports = authJwt;
