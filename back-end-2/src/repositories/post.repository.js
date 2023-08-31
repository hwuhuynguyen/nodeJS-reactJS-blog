const sequelize = require("../config/database.config");
const Post = require("../models/Post");

exports.addNewPost = (data) => {
	return Post.create(data)
		.then((result) => {
			console.log("New post inserted successfully");
			return result;
		})
		.catch((error) => {
			throw error;
		});
};

exports.findAllPosts = () => {
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT * FROM posts", (err, results) => {
			if (err) {
				reject(err);
			} else {
				if (results.length > 0) {
					console.log("Posts found successfully");
					resolve(results);
				} else {
					reject(new Error("Post not found"));
				}
			}
		});
	});
};

exports.findAllPostsAndItsAuthor = () => {
	return new Promise((resolve, reject) => {
		sequelize.query(
			"SELECT p.id, p.title, p.content, p.postPicture, p.createdAt, u.name, u.profilePicture " +
				"FROM posts p JOIN users u ON p.author = u.id",
			(err, results) => {
				if (err) {
					reject(err);
				} else {
					if (results.length > 0) {
						console.log("Posts found successfully");
						resolve(results);
					} else {
						reject(new Error("Post not found"));
					}
				}
			}
		);
	});
};

exports.findAllPostsAndItsAuthorAndStats = () => {
	const query = `SELECT p.id, p.title, p.content, p.postPicture, p.createdAt, u.name, u.profilePicture, 
    COUNT(DISTINCT c.id) AS comment_count, COUNT(DISTINCT lp.id) AS like_count
    FROM posts p
    JOIN users u ON p.author = u.id
    LEFT JOIN comments c ON p.id = c.post_id
    LEFT JOIN like_posts lp ON p.id = lp.post_id
    GROUP BY p.id, p.title, p.content, p.postPicture, p.createdAt, u.name, u.profilePicture;`;

	return sequelize
		.query(query, { type: sequelize.QueryTypes.SELECT })
		.then((results) => {
			if (results.length > 0) {
				console.log("Posts found successfully");
				return results;
			} else {
				throw new Error("Post not found");
			}
		})
		.catch((error) => {
			throw error;
		});
};

exports.findPostById = (id) => {
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT * FROM posts WHERE id = ?", id, (err, result) => {
			if (err) {
				reject(err);
			} else {
				if (result.length > 0) {
					console.log("Post found successfully");
					resolve(result);
				} else {
					reject(new Error("Post not found"));
				}
			}
		});
	});
};

exports.findPostByIdAndItsAuthor = (id) => {
	return new Promise((resolve, reject) => {
		sequelize.query(
			"SELECT p.id, p.title, p.content, p.postPicture, p.createdAt, u.name, u.profilePicture " +
				"FROM posts p JOIN users u ON p.author = u.id WHERE p.id = ?",
			id,
			(err, results) => {
				if (err) {
					reject(err);
				} else {
					if (results.length > 0) {
						console.log("Posts found successfully");
						resolve(results);
					} else {
						reject(new Error("Post not found"));
					}
				}
			}
		);
	});
};

exports.getPostsByUser = (userId) => {
	const query = `SELECT p.id, p.title, p.content, p.postPicture, p.createdAt, u.name, u.profilePicture, 
    COUNT(DISTINCT c.id) AS comment_count, COUNT(DISTINCT lp.id) AS like_count
    FROM posts p
    JOIN users u ON p.author = u.id
    LEFT JOIN comments c ON p.id = c.post_id
    LEFT JOIN like_posts lp ON p.id = lp.post_id
    WHERE p.author = :userID
    GROUP BY p.id, p.title, p.content, p.postPicture, p.createdAt, u.name, u.profilePicture;`;
	const replacements = {
		userID: userId,
	};
	return sequelize
		.query(query, {
			replacements: replacements,
			type: sequelize.QueryTypes.SELECT,
		})
		.then((results) => {
			if (results.length > 0) {
				console.log("Posts found successfully");
				return results;
			} else {
				throw new Error("Post not found");
			}
		})
		.catch((error) => {
			throw error;
		});
};

exports.updatePostById = (id, post) => {
	return Post.update(post, {
		where: { id: id },
	})
		.then((result) => {
			console.log("Post updated successfully");
			return result;
		})
		.catch((error) => {
			throw error;
		});
};

exports.findPostByIdAndItsAuthorAndLikeCount = (id) => {
	const query = `SELECT p.id, p.title, p.content, p.postPicture, p.author, p.createdAt, u.name, u.profilePicture , count(lp.id) AS like_count
    FROM posts p
    JOIN users u ON p.author = u.id
    LEFT JOIN like_posts lp ON p.id = lp.post_id
    WHERE p.id = :postID
    GROUP BY lp.post_id;`;
	const replacements = {
		postID: id,
	};
	return sequelize
		.query(query, {
			replacements: replacements,
			type: sequelize.QueryTypes.SELECT,
		})
		.then((results) => {
			if (results.length > 0) {
				console.log("Posts found successfully");
				return results;
			} else {
				throw new Error("Post not found");
			}
		})
		.catch((error) => {
			throw error;
		});
};

exports.findPostByIdAndItsAuthorAndLikeList = (id) => {
	const query = `SELECT p.id, p.title, p.content, p.postPicture, p.author, p.createdAt, u.name, u.profilePicture , count(lp.id) AS like_count,
			(SELECT group_concat(concat_ws(',', user_id) separator ';') 
			FROM like_posts 
			WHERE like_posts.post_id = p.id) AS likes
		FROM posts p
    JOIN users u ON p.author = u.id
    LEFT JOIN like_posts lp ON p.id = lp.post_id
    WHERE p.id = :postID
    GROUP BY lp.post_id;`;
	const replacements = {
		postID: id,
	};
	return sequelize
		.query(query, {
			replacements: replacements,
			type: sequelize.QueryTypes.SELECT,
		})
		.then((results) => {
			if (results.length > 0) {
				console.log("Posts found successfully");
				return results;
			} else {
				throw new Error("Post not found");
			}
		})
		.catch((error) => {
			throw error;
		});
};

exports.findRecentPosts = async () => {
	return await Post.findAll({
		order: [["createdAt", "DESC"]],
		limit: 5,
	})
		.then((results) => {
			if (results.length > 0) {
				console.log("Posts found successfully");
				return results;
			} else {
				throw new Error("Post not found");
			}
		})
		.catch((error) => {
			throw error;
		});
};
