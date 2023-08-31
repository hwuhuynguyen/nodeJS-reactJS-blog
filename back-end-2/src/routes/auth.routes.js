const express = require("express");

const { validateUserInput } = require("../middlewares/validate");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router
  .route("/login")
  .post(authController.login);

router
  .route("/register")
  .post(authController.signup);

router.route("/logout").get(authController.logout);

module.exports = router;
