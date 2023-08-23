const sequelize = require("../config/database.config");
const User = require("../models/User");
const Post = require("../models/Post");

exports.addNewUser = (data) => {
	return User.create(data)
		.then((user) => {
			console.log("New user inserted successfully");
			return user;
		})
		.catch((error) => {
			console.log(error.errors);
			throw error;
		});
};

exports.findAllUsers = async () => {
	return await User.findAll()
		.then((users) => {
			if (users.length > 0) {
				console.log("Users found successfully");
				return users;
			} else {
				throw new Error("User not found");
			}
		})
		.catch((error) => {
			throw error;
		});
};

exports.findUserById = async (id) => {
	return await User.findOne({
		raw: true,
		where: {
			id: id,
		},
	})
		.then((user) => {
			if (user) {
				console.log("User found successfully");
				return user;
			} else {
				throw new Error("User not found");
			}
		})
		.catch((error) => {
			// throw error;
			console.error("Failed to find user:", error);
		});
};

exports.findUserByEmail = async (email) => {
	return await User.findOne({
		raw: true,
		where: { email: email },
	})
		.then((user) => {
			if (user) {
				console.log("User found successfully");
				return user;
			} else {
				throw new Error("User not found");
			}
		})
		.catch((error) => {
			throw error;
		});
};

exports.checkIfUserExists = async (email) => {
	return await User.findOne({
		raw: true,
		where: { email: email },
	})
		.then((user) => {
			if (user) {
				throw new Error("Email address already in use!");
			}
		})
		.catch((error) => {
			throw error;
		});
};

exports.findUserByEmailAndPassword = async (email, password) => {
	return await User.findOne({
		raw: true,
		where: { email: email, password: password },
	})
		.then((user) => {
			if (user) {
				console.log("User found successfully");
				return user;
			} else {
				throw new Error("User not found");
			}
		})
		.catch((error) => {
			throw error;
		});
};

exports.updateUser = (id, user) => {
	console.log("Updating user");
	console.log(user);
	return User.update(user, {
		where: { id: parseInt(id, 10) },
	})
		.then((results) => {
			console.log("User updated successfully");
			return results;
		})
		.catch((error) => {
			throw error;
		});
};

exports.getUsersWithMostPosts = () => {
	const query = `SELECT u.id AS id, u.name AS name, u.email AS email, u.profilePicture AS profilePicture, COUNT(p.author) AS totalPosts
    FROM posts p
    JOIN users u ON p.author = u.id
    GROUP BY p.author, u.name, u.email, u.profilePicture
    ORDER BY totalPosts DESC
    LIMIT 5;`;

	return sequelize
		.query(query, { type: sequelize.QueryTypes.SELECT })
		.then((results) => {
			console.log("Users retrieved successfully");
			return results;
		})
		.catch((error) => {
			throw error;
		});
};
