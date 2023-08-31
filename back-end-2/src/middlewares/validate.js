const { prepareUserData, validateUser } = require('../utils/userUtils');

exports.validateUserInput = async (req, res, next) => {
	const userInput = prepareUserData(req);

	const validationErrors = await validateUser(userInput);

	if (validationErrors) {
    console.log("NOT DONE");
		res.status(400).json({
			error: "Validation Error",
			messages: validationErrors,
		});
		return;
	}
  console.log("DONE");  
  next();
};
