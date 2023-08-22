const userService = require("../service/user.service");
const postService = require("../service/post.service");
const commentService = require("../service/comment.service");
const likeService = require("../service/like.service");

exports.updateLikeInPost = async function (req, res, next) {
  console.log("get like in post");

  let usersLikedPostRow = await likeService
    .getUsersLikedPost(req.params.postId)
    .catch((err) => {});
  let usersLikedPost = [];

  if (usersLikedPostRow?.length > 0) {
    usersLikedPost = await usersLikedPostRow.map((user) => user.user_id);
  }

  if (!usersLikedPost.includes(req.user.id)) {
    usersLikedPost.push(req.user.id);
    await likeService.addLikeToLikePostList(req.user.id, req.params.postId);
  } else {
    const index = usersLikedPost.indexOf(req.user.id);
    if (index !== -1) {
      usersLikedPost.splice(index, 1); // Remove the user ID from the array
    }
    await likeService.removeLikeToLikePostList(req.user.id, req.params.postId);
  }
  console.log(usersLikedPost);
  console.log(req.user.id);
  const postRow = await postService.findPostByIdAndItsAuthorAndLikeCount(
    req.params.postId
  );
  // Convert the RowDataPacket object to JSON string and then parse it
  const rowJson = JSON.stringify(postRow);
  const post = JSON.parse(rowJson)[0];
  console.log(post);
  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
};

exports.updateLikeInComment = async function (req, res, next) {
  console.log("get like in comment");

  let usersLikedCommentRow = await likeService
    .getUsersLikedComment(req.params.commentId)
    .catch((err) => {});
  let usersLikedComment = [];

  if (usersLikedCommentRow?.length > 0) {
    usersLikedComment = await usersLikedCommentRow.map((user) => user.user_id);
  }

  if (!usersLikedComment.includes(req.user.id)) {
    usersLikedComment.push(req.user.id);
    await likeService.addLikeToLikeCommentList(req.user.id, req.params.commentId);
  } else {
    const index = usersLikedComment.indexOf(req.user.id);
    if (index !== -1) {
      usersLikedComment.splice(index, 1); // Remove the user ID from the array
    }
    await likeService.removeLikeToLikeCommentList(req.user.id, req.params.commentId);
  }
  console.log(usersLikedComment);
  console.log(req.user.id);
  const commentRow = await commentService.findCommentByIdAndItsAuthorAndLikeCount(
    req.params.commentId
  );
  // Convert the RowDataPacket object to JSON string and then parse it
  const rowJson = JSON.stringify(commentRow);
  const comment = JSON.parse(rowJson)[0];
  console.log(comment);
  res.status(200).json({
    status: "success",
    data: {
      comment,
    },
  });
};
