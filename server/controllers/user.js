const User = require("../models/User");
const bcrypt = require("bcryptjs");
const auth = require("../auth");
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email) {
	return String(email || "")
		.trim()
		.toLowerCase();
}

function castErrorResponse(err) {
	return {
		error: "Failed in Find",
		details: {
			stringValue: err.stringValue,
			valueType:
				err.valueType ??
				(typeof err.value === "string" ? "string" : typeof err.value),
			kind: err.kind,
			value: err.value,
			path: err.path,
			reason: err.reason && typeof err.reason === "object" ? err.reason : {},
			name: err.name,
			message: err.message,
		},
	};
}

module.exports.registerUser = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		if (!username) {
			return res.status(400).json({ error: "Username is required" });
		}

		if (!EMAIL_REGEX.test(email || "")) {
			return res.status(400).json({ error: "Email invalid" });
		}

		if (typeof password !== "string" || password.length < 8) {
			return res.status(400).json({
				error: "Password must be atleast 8 characters",
			});
		}

		const emailNorm = normalizeEmail(email);
		const existing = await User.findOne({ email: emailNorm });

		if (existing) {
			return res.status(409).json({ error: "Duplicate email found" });
		}

		const newUser = new User({
			username,
			email: emailNorm,
			password: bcrypt.hashSync(password, 10),
		});

		await newUser.save();
		return res.status(201).json({ message: "Registered Successfully" });
	} catch (err) {
		if (err.code === 11000) {
			return res.status(409).json({ error: "Duplicate email found" });
		}

		return res.status(500).json({ error: "Server error" });
	}
};

module.exports.loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!EMAIL_REGEX.test(email || "")) {
			return res.status(400).json({ error: "Invalid Email" });
		}

		const emailNorm = normalizeEmail(email);
		const user = await User.findOne({ email: emailNorm });

		if (!user) {
			return res.status(404).json({ error: "No Email Found" });
		}

		const isPasswordCorrect = bcrypt.compareSync(password, user.password);

		if (!isPasswordCorrect) {
			return res.status(401).json({
				error: "Email and password do not match",
			});
		}

		return res.status(200).json({ access: auth.createAccessToken(user) });
	} catch (err) {
		return res.status(500).json({ error: "Server error" });
	}
};

module.exports.getProfile = async (req, res) => {
	try {
		if (!req.user || !req.user.id) {
			return res.status(404).json({ error: "User not found" });
		}

		const user = await User.findById(req.user.id).select("-password").lean();

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		return res.status(200).json({ user });
	} catch (err) {
		if (err.name === "CastError") {
			return res.status(500).json(castErrorResponse(err));
		}

		return res.status(500).json({ error: "Server error" });
	}
};

module.exports.setAsAdmin = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).json({ error: "User not Found" });
		}

		user.isAdmin = true;
		await user.save();
		return res.status(200).json({ updatedUser: user.toObject() });
	} catch (err) {
		if (err.name === "CastError") {
			return res.status(500).json(castErrorResponse(err));
		}

		return res.status(500).json({ error: "Server error" });
	}
};

module.exports.updatePassword = async (req, res) => {
	try {
		const raw =
			req.body.password ?? req.body.newPassword ?? req.body.new_password;

		if (raw === undefined || raw === null || String(raw).length === 0) {
			return res.status(400).json({ error: "Password is required" });
		}

		const passwordStr = String(raw);
		const hashed = bcrypt.hashSync(passwordStr, 10);
		const user = await User.findByIdAndUpdate(
			req.user.id,
			{ password: hashed },
			{ new: true },
		);

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		return res.status(201).json({ message: "Password reset successfully" });
	} catch (err) {
		if (err.name === "CastError") {
			return res.status(500).json(castErrorResponse(err));
		}

		return res.status(500).json({ error: "Server error" });
	}
};
