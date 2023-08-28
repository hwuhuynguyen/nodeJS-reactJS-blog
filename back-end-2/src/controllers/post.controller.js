const multer = require("multer");
const path = require("path");

const postRepository = require("../repositories/post.repository");
const commentRepository = require("../repositories/comment.repository");
const Post = require("./../models/Post");

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

var upload = multer({ storage: storage });

exports.getAllPosts = async function (req, res, next) {
	const date = Date.now();

	const posts = await postRepository.findAllPosts();

	console.log("Find all: ", Date.now() - date);
	res.status(200).json({
		length: posts.length,
		data: posts,
	});
};

exports.getPostById = async function (req, res, next) {
	const time = Date.now();
	const post = await postRepository.findPostById(req.params.id);
	if (post.length === 0) {
		return res.status(404).json({
			message: "Post not found with that ID",
		});
	}
	const comments = await commentRepository.findAllCommentsByPost(req.params.id);
	console.log("Time to find post by ID: ", Date.now() - time);
	res.status(200).json({
		data: post,
	});
};

exports.getAllPostsByUserId = async function (req, res, next) {
	const posts = await postRepository.getPostsByUser({
		author: req.params.userId,
	});

	res.status(200).json({
		length: posts.length,
		data: posts,
	});
};

// Function to handle post validation and return error messages if validation fails
async function validatePost(postData) {
	try {
		const checkPost = await Post.build({
			title: postData.title,
			content: postData.content,
			author: postData.author,
		});
		await checkPost.validate();
		return null; // Validation successful
	} catch (validationError) {
		const errorMessages = validationError.errors.map((error) => error.message);
		return errorMessages;
	}
}

// Function to prepare post data, including handling the post picture
function preparePostData(req, userId) {
	const dataPost = {
		title: req.body.title,
		content: req.body.content,
		author: userId,
	};

	if (req.file) {
		const convertedPath = "/" + path.relative("src/public", req.file.path);
		dataPost.postPicture = convertedPath;
	}

	return dataPost;
}

exports.createPost = async function (req, res, next) {
	try {
		if (!req.body.author) req.body.author = req.user.id;
		upload.single("postPicture")(req, res, async (err) => {
			if (err) {
				// Handle the error if the file upload fails
				return next(err);
			}
			const authorId = req.user.id;
			const postData = preparePostData(req, authorId);
			const validationErrors = await validatePost(postData);
			if (validationErrors) {
				res.status(400).json({
					error: "Validation Error",
					messages: validationErrors,
				});
				return;
			}

			const post = await postRepository.addNewPost(postData);
			res.status(200).json({
				post,
			});
		});
	} catch (error) {
		res.status(409).json({
			error,
			message: error.message,
		});
	}
};

exports.updatePost = async function (req, res, next) {
	upload.single("postPicture")(req, res, async (err) => {
		if (err) {
			// Handle the error if the file upload fails
			console.error(err);
			return next(err);
		}

		const dataPost = {
			title: req.body.title,
			content: req.body.content,
		};

		if (req.file) {
			let convertedPath = "/" + path.relative("src/public", req.file.path);
			dataPost.postPicture = convertedPath;
		}

		const post = await postRepository.updatePostById(req.params.id, dataPost);

		res.status(200).json({
			post,
		});
	});
};
