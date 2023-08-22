const connection = require("../config/database.config");
const commentService = require("../service/comment.service");

exports.setPostUserIds = (req, res, next) => {
  if (!req.body.post) req.body.post = req.params.postId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllComments = async function (req, res, next) {
  const comments = await Comment.find();

  res.status(200).json({
    status: "success",
    length: comments.length,
    data: comments,
  });
};

exports.getCommentById = async function (req, res, next) {
  const comment = await Comment.findById(req.params.commentId);
  console.log("get comment by id");

  if (!comment) {
    return res.status(404).json({
      status: "fail",
      message: "Comment not found",
    });
  }

  res.status(200).json({ 
    status: "success",
    data: comment,
  });
};

exports.getAllCommentsByPost = async function (req, res, next) {
  if (!req.body.post) req.body.post = req.params.postId;
  const comments = await commentService.findAllCommentsByPost(req.params.postId);

  res.status(200).json({
    status: "success",
    length: comments.length,
    data: comments,
  });
};

exports.createComment = async function (req, res, next) {
  if (!req.body.post) req.body.post = req.params.postId;
  if (!req.body.user) req.body.user = req.user.id;
  console.log("REQUEST: ", req.body);
  console.log("END REQUEST");
  
  const comment = await commentService.addNewComment({
    content: req.body.content,
    post_id: parseInt(req.body.post, 10),
    user_id: req.body.user
  });
  console.log("comment before creation: ", comment);
  if (!req.params.commentId) comment.path = String(comment.id).padStart(6, '0');
  else {
    const parentComment = await commentService.findCommentById(req.params.commentId);
    console.log("parent comment: ", parentComment);
    comment.path = parentComment.path + "." + String(comment.id).padStart(6, '0');
  }
  await commentService.updateComment(comment, comment.id);

  const row = await commentService.findCommentById(comment.id);
  console.log(row);
  const newComment = await commentService.findCommentByIdAndItsAuthorAndLikeCount(comment.id);

  res.status(200).json({
    status: "success",
    post: req.body.post,
    user: req.body.user,
    data: newComment,
  });
};

exports.getSubCommentsByCommentId = async (req, res, next) => {
  const comments = await Comment.find({
    path: {
      $regex: new RegExp(req.params.commentId),
    },
  });

  res.status(201).json({
    status: "success",
    length: comments.length,
    data: comments,
  });
};
