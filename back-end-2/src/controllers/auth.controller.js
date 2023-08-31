const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const userRepository = require("../repositories/user.repository");
const User = require("./../models/User");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "src/public/img");
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const fileExtension = file.originalname.split(".").pop();
		cb(null, uniqueSuffix + "." + fileExtension);
	},
});
const imageFilter = (req, file, cb) => {
	if (
		file.mimetype === "image/jpeg" ||
		file.mimetype === "image/png" ||
		file.mimetype === "image/gif"
	) {
		cb(null, true);
	} else {
		cb(new Error("Only image files are allowed!"), false);
	}
};

var upload = multer({ storage: storage, fileFilter: imageFilter });

exports.uploadProfilePicture = async (req, res, next) => {
	upload.single("profilePicture");
};

const signToken = (id) =>
	jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

exports.createSendToken = (user, statusCode, res) => {
	const token = signToken(user.id);

	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	res.cookie("jwt", token, cookieOptions);
	console.log("jwt token created successfully");

	res.status(statusCode).json({
		token,
		data: {
			user,
		},
	});
};

async function validateUserInput(userInput) {
	try {
		const checkUser = await User.build(userInput);
		await checkUser.validate();
		return null; // No validation errors
	} catch (validationError) {
		const errorMessages = validationError.errors.map((error) => error.message);
		return errorMessages;
	}
}

function prepareUserData(req) {
	const dataUser = {
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		gender: req.body.gender,
		dateOfBirth: req.body.dateOfBirth,
	};

	if (req.file) {
		const convertedPath = "/" + path.relative("src/public", req.file.path);
		dataUser.profilePicture = convertedPath;
	}

	return dataUser;
}

exports.signup = catchAsync(async (req, res, next) => {
	upload.single("profilePicture")(req, res, async (err) => {
		try {
			if (err) {
				console.error(err);
				res.status(400).json({
					message: 'Please upload the correct image format: jpg, png, gif.'
				})
				return next(err);
			}
			const dataUser = prepareUserData(req);
			const validationErrors = await validateUserInput(dataUser);
			if (validationErrors) {
				res.status(400).json({
					error: "Validation Error",
					messages: validationErrors,
				});
				return;
			}
			await userRepository.addNewUser(dataUser);
			let newUser = await userRepository.findUserByEmail(req.body.email);
			this.createSendToken(newUser, 201, res);
		} catch (error) {
			res.status(409).json({
				error,
				message: error.message,
			});
		}
	});
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(new AppError("Please provide email and password!"), 400);
	}
	const user = await userRepository
		.findUserByEmailAndPassword(email, password)
		.catch((err) => {});
	if (user) {
		this.createSendToken(user, 200, res);
	} else {
		return next(new AppError("Incorrect username or password!"), 401);
	}
});

exports.logout = catchAsync(async (req, res, next) => {
	const cookieOptions = {
		expires: new Date(Date.now()),
		httpOnly: true,
	};
	res.clearCookie("jwt");
});

exports.restrictTo =
	(...roles) =>
	(req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError("You do not have permission to perform this action."),
				403
			);
		}
		next();
	};

exports.protect = catchAsync(async (req, res, next) => {
	const date = Date.now();
	// 1. Getting token and check if it's there
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer ")
	) {
		token = req.headers.authorization.split(" ")[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}
	if (!token) {
		return next(
			new AppError("You are not logged in! Please login to get access", 401)
		);
	}
	// 2. Verification token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	// 3. Check if the user still exists
	const currentUser = await userRepository
		.findUserById(decoded.id)
		.catch((err) => {});
	if (currentUser) {
		// GRANT ACCESS TO PROTECTED ROUTE
		res.locals.user = currentUser;
		req.user = currentUser;
		console.log("Auth: ", Date.now() - date);
		console.log("User:", req.user);
	} else {
		return next(
			new AppError(
				"The user belonging to this token does no longer exist!",
				401
			)
		);
	}
	next();
});

exports.isLoggedIn = async (req, res, next) => {
	try {
		// 1. Getting token and check if it's there
		let token = req.cookies.jwt;

		if (!token) {
			return next();
		}
		// 2. Verification token
		const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

		// 3. Check if the user still exists
		const currentUser = await userRepository.findUserById(decoded.id);
		if (currentUser) {
			console.log("User:", currentUser);
			// GRANT ACCESS TO PROTECTED ROUTE
			res.locals.user = currentUser;
			req.user = currentUser;
		}
		return next();
	} catch (err) {
		next();
	}
};
