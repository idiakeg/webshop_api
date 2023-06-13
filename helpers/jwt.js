const { expressjwt: expressJwt } = require("express-jwt");

// This module provides Express middleware for validating JWTs (JSON Web Tokens) through the jsonwebtoken module. The decoded JWT payload is available on the request object.

const authJwt = () => {
	const secret = process.env.SECRET;
	const api = process.env.API_ROOT;
	return expressJwt({
		secret,
		algorithms: ["HS256"],
	}).unless({
		path: [
			{ url: /\/api\/v1\/products(.*)/, methods: ["GET"] },
			{ url: /\/api\/v1\/categories(.*)/, methods: ["GET"] },
			`${api}/users/login`,
		],
	});
};

module.exports = authJwt;
