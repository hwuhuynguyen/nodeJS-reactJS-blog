const express = require("express");
const commentController = require("../controllers/comment.controller");
const authController = require("../controllers/auth.controller");
const likeRouter = require("../routes/like.routes");

const router = express.Router({ mergeParams: true });

router.use('/:commentId/like', likeRouter);

router
  .route("/")
  .get(commentController.getAllCommentsByPost)
  .post(authController.protect, commentController.createComment);
  
router
  .route("/:commentId")
  .get(commentController.getCommentById)
  .post(authController.protect, commentController.createComment);

router
  .route("/:commentId/sub")
  .get(commentController.getSubCommentsByCommentId);

module.exports = router;
