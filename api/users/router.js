const express = require("express");
const controller = require("./controller");

const router = express.Router();

router.route("/").post(controller.usersCreate);

// router.route("/login").post(controller.loginUser);

// router.route("/me").get(isUser, controller.me);

// router
//   .route("/:id")
//   .get(isUser, controller.usersShow)
//   .put(controller.usersUpdate);

module.exports = router;
