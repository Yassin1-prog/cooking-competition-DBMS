const { Router } = require("express");

cookRouter = Router();
const cookController = require("../controllers/cookController");

cookRouter.get("/", cookController.getcook);
cookRouter.get("/create", cookController.createGameGet);
cookRouter.post("/create", cookController.createGame);
cookRouter.get("/:id", cookController.getGame);
cookRouter.get("/:id/update", cookController.gameUpdateGet);
cookRouter.post("/:id/update", cookController.updateGame);
cookRouter.post("/:id/delete", cookController.deleteGame);

module.exports = cookRouter;
