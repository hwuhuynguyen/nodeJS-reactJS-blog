const express = require("express");

const userController = require("../controllers/user.controller");
// const postController = require("../controllers/post.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();

// router.get("/:userId/posts", postController.getAllPostsByUserId);

// router.post("/signup", authController.signup);
router.post("/login", authController.login);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUserById)
  .patch(userController.updateUser);

module.exports = router;
