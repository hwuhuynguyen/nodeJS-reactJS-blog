const userRepository = require("../repositories/user.repository");
const postRepository = require("../repositories/post.repository");
const commentRepository = require("../repositories/comment.repository");

exports.callAPIForHomePage = async function (req, res, next) {
	const activeUsers = await userRepository.getUsersWithMostPosts();
	const posts = await postRepository.findAllPostsAndItsAuthorAndStats();
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
	const row = await postRepository.findPostByIdAndItsAuthorAndLikeList(
		req.params.postId
	);
	const post = JSON.parse(JSON.stringify(row))[0]; // Convert the RowDataPacket object to JSON string and then parse it
	post.createdAt = new Date(post.createdAt);

	const comments =
		await commentRepository.getCommentSortedOfAPostAndAddLevelAndLikeList(
			parseInt(req.params.postId, 10)
		);

	res.status(200).json({
		post,
		comments,
	});
};

exports.callAPIForDashboard = async function (req, res, next) {
	const myPosts =
		(await postRepository.getPostsByUser(req.user.id).catch((err) => {})) || [];
	req.user.dateOfBirth = new Date(req.user.dateOfBirth);

	res.status(200).json({
		myPosts,
	});
};
