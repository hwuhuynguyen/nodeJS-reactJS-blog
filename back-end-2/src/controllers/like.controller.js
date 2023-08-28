const postRepository = require("../repositories/post.repository");
const commentRepository = require("../repositories/comment.repository");
const likeRepository = require("../repositories/like.repository");

exports.updateLikeInPost = async function (req, res, next) {
  let usersLikedPostRow = await likeRepository
    .getUsersLikedPost(req.params.postId)
    .catch((err) => {});
  let usersLikedPost = [];

  if (usersLikedPostRow?.length > 0) {
    usersLikedPost = await usersLikedPostRow.map((user) => user.user_id);
  }

  if (!usersLikedPost.includes(req.user.id)) {
    usersLikedPost.push(req.user.id);
    await likeRepository.addLikeToLikePostList(req.user.id, req.params.postId);
  } else {
    const index = usersLikedPost.indexOf(req.user.id);
    if (index !== -1) {
      usersLikedPost.splice(index, 1); // Remove the user ID from the array
    }
    await likeRepository.removeLikeToLikePostList(req.user.id, req.params.postId);
  }
  console.log(usersLikedPost);
  console.log(req.user.id);
  const postRow = await postRepository.findPostByIdAndItsAuthorAndLikeCount(
    req.params.postId
  );
  // Convert the RowDataPacket object to JSON string and then parse it
  const post = JSON.parse(JSON.stringify(postRow))[0];
  res.status(200).json({
    data: {
      post,
    },
  });
};

exports.updateLikeInComment = async function (req, res, next) {
  console.log("get like in comment");

  let usersLikedCommentRow = await likeRepository
    .getUsersLikedComment(req.params.commentId)
    .catch((err) => {});
  let usersLikedComment = [];

  if (usersLikedCommentRow?.length > 0) {
    usersLikedComment = await usersLikedCommentRow.map((user) => user.user_id);
  }

  if (!usersLikedComment.includes(req.user.id)) {
    usersLikedComment.push(req.user.id);
    await likeRepository.addLikeToLikeCommentList(req.user.id, req.params.commentId);
  } else {
    const index = usersLikedComment.indexOf(req.user.id);
    if (index !== -1) {
      usersLikedComment.splice(index, 1); // Remove the user ID from the array
    }
    await likeRepository.removeLikeToLikeCommentList(req.user.id, req.params.commentId);
  }
  console.log(usersLikedComment);
  console.log(req.user.id);
  const commentRow = await commentRepository.findCommentByIdAndItsAuthorAndLikeCount(
    req.params.commentId
  );
  // Convert the RowDataPacket object to JSON string and then parse it
  const comment = JSON.parse(JSON.stringify(commentRow))[0];
  res.status(200).json({
    data: {
      comment,
    },
  });
};
