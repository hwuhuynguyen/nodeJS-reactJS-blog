const User = require("./../models/User");

exports.prepareUserData = (req) => {
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

exports.validateUser = async (userInput) => {
	try {
		const checkUser = await User.build(userInput);
		console.log(checkUser);
		await checkUser.validate();
		return null; // No validation errors
	} catch (validationError) {
		const errorMessages = validationError.errors.map((error) => error.message);
		return errorMessages;
	}
}
