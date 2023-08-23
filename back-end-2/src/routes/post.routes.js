const express = require("express");

const postController = require("../controllers/post.controller");
const authController = require("../controllers/auth.controller");

const commentRouter = require("../routes/comment.routes");
const likeRouter = require("../routes/like.routes");

const router = express.Router({ mergeParams: true });

router.use('/:postId/comments', commentRouter);
router.use('/:postId/like', likeRouter);
router.use(authController.isLoggedIn); 

router
  .route("/")
  .get(postController.getAllPosts)
  .post(authController.protect, postController.createPost);

router
  .route("/:id")
  .get(postController.getPostById)
  .patch(postController.updatePost);

module.exports = router;
