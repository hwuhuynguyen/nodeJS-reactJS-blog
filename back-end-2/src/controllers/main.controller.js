const userRepository = require("../repositories/user.repository");
const postRepository = require("../repositories/post.repository");
const commentRepository = require("../repositories/comment.repository");
const likeRepository = require("../repositories/like.repository");

exports.callAPIForHomePage = async function (req, res, next) {
	const activeUsers = await userRepository.getUsersWithMostPosts();
	const date = Date.now();
	const posts = await postRepository.findAllPostsAndItsAuthorAndStats();
	console.log("Find all: ", Date.now() - date);
	const recentPosts = await postRepository.findRecentPosts();

	res.status(200).json({
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
		length: posts.length,
		posts,
	});
};

exports.callAPIForPostDetailUpdated = async function (req, res, next) {
	const row = await postRepository.findPostByIdAndItsAuthorAndLikeCount(
		req.params.postId
	);
	const post = JSON.parse(JSON.stringify(row))[0]; // Convert the RowDataPacket object to JSON string and then parse it
	post.createdAt = new Date(post.createdAt);

	let comments;

	if (typeof req.user !== "undefined") {
		const isUserLikedPost = await likeRepository.checkUserLikedPostOrNot(
			req.user.id,
			parseInt(req.params.postId, 10),
		);
		(isUserLikedPost[0].isLiked ? post.isLiked = true : post.isLiked = false);
		
		comments =
			await commentRepository.getCommentSortedOfAPostAndAddLevelAndIsLikedOrNot(
				parseInt(req.params.postId, 10),
				req.user.id
			);
		for (let comment of comments) {
			const likeCount = await likeRepository.getLikesOfAComment(comment.id);
			likeCount.map((element) => (comment.like = element.like_count));
		}
	} else {
		comments = await commentRepository.getCommentSortedOfAPostAndAddLevel(
			parseInt(req.params.postId, 10)
		);
	}
	res.status(200).json({
		post,
		comments,
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
		myPosts,
	});
};
