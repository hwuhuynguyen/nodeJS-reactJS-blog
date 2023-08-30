const express = require("express");

const userController = require("../controllers/user.controller");

const router = express.Router();

router
  .route("/:id")
  .get(userController.getUserById)
  .patch(userController.updateUser);

module.exports = router;
