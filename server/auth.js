const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin,
	};
	return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
};

module.exports.verify = (req, res, next) => {
	let token = req.headers.authorization;

	if (typeof token === "undefined") {
		return res.send({ auth: "Failed. No Token" });
	}

	if (!token.startsWith("Bearer ")) {
		return res.send({ auth: "Failed. No Token" });
	}

	token = token.slice(7);

	jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
		if (err) {
			return res.status(403).send({ auth: "Failed", message: err.message });
		}

		req.user = decoded;
		next();
	});
};

module.exports.verifyNonAdmin = (req, res, next) => {
	if (req.user.isAdmin === true) {
		return res.status(403).send({ message: "Action Forbidden" });
	}

	next();
};

module.exports.verifyAdmin = (req, res, next) => {
	if (!req.user || req.user.isAdmin !== true) {
		return res.status(403).json({
			error: "Forbidden",
			message: "Admin access required",
		});
	}
	next();
};

module.exports.errorHandler = (err, req, res, next) => {
	console.error(err);

	const statusCode = err.status || 500;
	const errorMessage = err.message || "Internal Server Error";

	res.status(statusCode).json({
		error: {
			message: errorMessage,
			errorCode: err.code || "SERVER_ERROR",
			details: err.details || null,
		},
	});
};
