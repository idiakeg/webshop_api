const { expressjwt: expressJwt } = require("express-jwt");

// This module provides Express middleware for validating JWTs (JSON Web Tokens) through the jsonwebtoken module. The decoded JWT payload is available on the request object.

const authJwt = () => {
	const secret = process.env.SECRET;
	const api = process.env.API_ROOT;
	return expressJwt({
		secret,
		algorithms: ["HS256"],
		isRevoked: isRevoked,
	}).unless({
		path: [
			{ url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
			{ url: /\/api\/v1\/categories(.*)/, methods: ["GET"] },
			`${api}/users/login`,
		],
	});
};

// payload contains data present in the token

async function isRevoked(req, payload) {
	if (payload.isAdmin === false) {
		return true;
	}
	return false;
}

module.exports = authJwt;
