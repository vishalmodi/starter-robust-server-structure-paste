const router = require("express").Router();
const controller = require("./users.controller");
const metthodNotAllowed = require("../errors/method-not-allowed");
const pastesRouter = require("../pastes/pastes.router");

router.use("/:userId/pastes", controller.userExists, pastesRouter);

router.route("/").get(controller.list).all(metthodNotAllowed);

router.route("/:userId").get(controller.read).all(metthodNotAllowed);
module.exports = router;
