const { Router } = require("express");

compRouter = Router();
const compController = require("../controllers/compController");

compRouter.get("/", compController.getcomp);
compRouter.get("/create", compController.createGameGet);
compRouter.post("/create", compController.createGame);
compRouter.get("/:id", compController.getGame);
compRouter.get("/:id/update", compController.gameUpdateGet);
compRouter.post("/:id/update", compController.updateGame);
compRouter.post("/:id/delete", compController.deleteGame);

module.exports = compRouter;
