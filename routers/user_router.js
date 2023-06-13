const { Router } = require("express");
const UserModel = require("../models/user_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = Router();

router.get("/", async (req, res) => {
	const userList = await UserModel.find({}).select("-passwordHash");

	if (!userList) {
		res.status(500).json({
			success: false,
		});
	} else {
		res.status(200).json(userList);
	}
});

router.get("/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const user = await UserModel.findById(id).select("-passwordHash");
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "No such user!",
			});
		}

		res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error,
		});
	}
});

router.post("/", async (req, res) => {
	// obtain the desired field from the clients request
	const {
		name,
		email,
		passwordHash,
		phone,
		isAdmin,
		street,
		apartment,
		zip,
		city,
		country,
	} = req.body;
	try {
		const user = await UserModel.create({
			name,
			email,
			passwordHash: bcrypt.hashSync(passwordHash, 10),
			phone,
			isAdmin,
			street,
			apartment,
			zip,
			city,
			country,
		});
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "could not create user!",
			});
		}

		res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error,
		});
	}
});

router.post("/login", async (req, res) => {
	// the user will be required to provide an email and password. the email will be used to verify that the user exists in our DB and the provided password will be checked against our hashed password for authentication
	const { email, password } = req.body;

	const secret = process.env.SECRET;

	try {
		const user = await UserModel.findOne({ email });
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found!",
			});
		}

		if (user && bcrypt.compareSync(password, user.passwordHash)) {
			const token = jwt.sign(
				{ userId: user.id, isAdmin: user.isAdmin },
				secret,
				{
					expiresIn: "1d",
				}
			);

			res.status(200).json({
				success: true,
				accessToken: token,
			});
		} else {
			res.status(400).json({
				success: false,
				message: "Password is wrong!",
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			error,
		});
	}
});

module.exports = router;
