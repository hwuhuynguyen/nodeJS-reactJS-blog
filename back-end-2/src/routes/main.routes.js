const express = require("express");

const authController = require("../controllers/auth.controller");
const mainController = require("../controllers/main.controller");

const router = express.Router();

router.use(authController.isLoggedIn);

router.route("/home-page").get(mainController.callAPIForHomePage);

router.route("/posts").get(mainController.callAPIForPostsPage);

router
	.route("/posts/:postId")
	.get(authController.protect, mainController.callAPIForPostDetailUpdated);

router
	.route("/dashboard")
	.get(authController.protect, mainController.callAPIForDashboard);

module.exports = router;
