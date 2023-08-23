const express = require("express");

const postController = require("../controllers/post.controller");
const authController = require("../controllers/auth.controller");
const viewController = require("../controllers/view.controller");

const commentRouter = require("../routes/comment.routes");
// const likeRouter = require("../routes/like.routes");

const router = express.Router();

router.use(authController.isLoggedIn);

router.route('/home-page').get(viewController.displayHomePage);

router.route('/posts').get( viewController.displayPosts);
// router.route('/posts').get(authController.protect, viewController.displayPosts);

router.route('/posts/:postId').get(authController.protect, viewController.displayPostDetailById);

router.route('/auth/login').get(authController.checkLoggedIn, viewController.displayLoginPage);

router.route('/auth/register').get(authController.checkLoggedIn, viewController.displayRegisterPage);

router.route('/auth/logout').get(authController.logout);

router.route('/dashboard').get(authController.protect, viewController.displayDashboard);

module.exports = router;
