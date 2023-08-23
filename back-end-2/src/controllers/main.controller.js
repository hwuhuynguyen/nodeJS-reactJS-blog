const userRepository = require("../repositories/user.repository");
const postRepository = require("../repositories/post.repository");
const commentRepository = require("../repositories/comment.repository");
const likeRepository = require("../repositories/like.repository");

exports.callAPIForHomePage = async function (req, res, next) {
	const activeUsers = await userRepository.getUsersWithMostPosts();
	console.log(activeUsers);
	const date = Date.now();
	const posts = await postRepository.findAllPostsAndItsAuthorAndStats();
	console.log(posts);
	console.log("Find all: ", Date.now() - date);
	const recentPosts = await postRepository.findRecentPosts();

	res.status(200).json({
		status: "success",
		data: {
			posts,
			recentPosts,
			activeUsers,
		},
	});
};

exports.callAPIForPostsPage = async function (req, res, next) {
	const posts = await postRepository.findAllPostsAndItsAuthorAndStats();

	res.status(200).json({
		status: "success",
		length: posts.length,
		posts,
	});
};

exports.callAPIForPostDetail = async function (req, res, next) {
	const row = await postRepository.findPostByIdAndItsAuthorAndLikeCount(
		req.params.postId
	);
	// Convert the RowDataPacket object to JSON string and then parse it
	const rowJson = JSON.stringify(row);
	const post = JSON.parse(rowJson)[0];
	post.createdAt = new Date(post.createdAt);

	const comments = await commentRepository.getCommentSortedOfAPost(
		parseInt(req.params.postId, 10)
	);
	comments.map((comment) => {
		comment.level = comment.path.split(".").length;
	});

	const usersLikedPostRow = await likeRepository
		.getUsersLikedPost(req.params.postId)
		.catch((error) => {});

	let usersLikedPost = [];
	if (usersLikedPostRow?.length > 0) {
		usersLikedPost = usersLikedPostRow.map((user) => user.user_id);
		console.log(usersLikedPost);
	}

	if (typeof req.user !== "undefined") {
		console.log("check post and comment like or not");
		if (usersLikedPost.includes(req.user.id)) {
			post.isLiked = true;
		} else {
			post.isLiked = false;
		}
		// post.save();
		for (let comment of comments) {
			try {
				const likeCount = await likeRepository.getLikesOfAComment(comment.id);
				likeCount.map((element) => (comment.like = element.like_count));

				const usersLikedCommentRow = await likeRepository.getUsersLikedComment(
					comment.id
				);
				if (usersLikedCommentRow.length > 0) {
					const usersLikedComment = usersLikedCommentRow.map(
						(user) => user.user_id
					);
					if (await usersLikedComment.includes(req.user.id)) {
						console.log("true");
						comment.isLiked = true;
					} else {
						console.log("false");
						comment.isLiked = false;
					}
					console.log("comment after save: " + comment.isLiked);
				}
			} catch (err) {}
		}
	}
	console.log(comments);
	res.status(200).json({
		status: 'success',
		post,
		comments
	});
};

exports.displayLoginPage = async function (req, res, next) {
	res.render("auth/login");
};

exports.displayRegisterPage = async function (req, res, next) {
	res.render("auth/register");
};

exports.callAPIForDashboard = async function (req, res, next) {
	const myPosts =
		(await postRepository.getPostsByUser(req.user.id).catch((err) => {})) || [];
	req.user.dateOfBirth = new Date(req.user.dateOfBirth);

	res.status(200).json({
		status: 'success',
		myPosts
	});
};
