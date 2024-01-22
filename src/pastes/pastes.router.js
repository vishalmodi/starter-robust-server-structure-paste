const router = require("express").Router({ mergeParams: true });
const controller = require("./pastes.controller");
const metthodNotAllowed = require("../errors/method-not-allowed");

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(metthodNotAllowed);

router
  .route("/:pasteId")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete)
  .all(metthodNotAllowed);

module.exports = router;
