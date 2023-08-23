const express = require("express");

const postController = require("../controllers/post.controller");
const authController = require("../controllers/auth.controller");
const viewController = require("../controllers/view.controller");
const mainController = require("../controllers/main.controller");

const router = express.Router();

router.use(authController.isLoggedIn);

router.route("/home-page").get(mainController.callAPIForHomePage);

// router.route("/posts").get(viewController.displayPosts);

router
	.route("/posts/:postId")
	.get(authController.protect, mainController.callAPIForPostDetail);

router
	.route("/dashboard")
	.get(authController.protect, mainController.callAPIForDashboard);

module.exports = router;
