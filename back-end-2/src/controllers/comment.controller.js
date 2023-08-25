const commentRepository = require("../repositories/comment.repository");

exports.setPostUserIds = (req, res, next) => {
  if (!req.body.post) req.body.post = req.params.postId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllComments = async function (req, res, next) {
  const comments = await Comment.find();

  res.status(200).json({
    length: comments.length,
    data: comments,
  });
};

exports.getCommentById = async function (req, res, next) {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return res.status(404).json({
      message: "Comment not found",
    });
  }

  res.status(200).json({ 
    data: comment,
  });
};

exports.getAllCommentsByPost = async function (req, res, next) {
  if (!req.body.post) req.body.post = req.params.postId;
  const comments = await commentRepository.findAllCommentsByPost(req.params.postId);

  res.status(200).json({
    length: comments.length,
    data: comments,
  });
};

exports.createComment = async function (req, res, next) {
  if (!req.body.post) req.body.post = req.params.postId;
  if (!req.body.user) req.body.user = req.user.id;
  
  const comment = await commentRepository.addNewComment({
    content: req.body.content,
    post_id: parseInt(req.body.post, 10),
    user_id: req.body.user
  });
  console.log("comment before creation: ", comment);
  if (!req.params.commentId) comment.path = String(comment.id).padStart(6, '0');
  else {
    const parentComment = await commentRepository.findCommentById(req.params.commentId);
    console.log("parent comment: ", parentComment);
    comment.path = parentComment.path + "." + String(comment.id).padStart(6, '0');
  }
  await commentRepository.updateComment(comment, comment.id);

  const newComment = await commentRepository.findCommentByIdAndItsAuthorAndLikeCount(comment.id);

  res.status(200).json({
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
    length: comments.length,
    data: comments,
  });
};
