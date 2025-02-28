const { Router } = require("express");

cookRouter = Router();
const cookController = require("../controllers/cookController");

cookRouter.get("/", cookController.getCooks);
cookRouter.post("/create", cookController.createCook);
cookRouter.get("/:id", cookController.getCook);
cookRouter.post("/:id/update", cookController.updateCook);
cookRouter.post("/:id/delete", cookController.deleteCook);

module.exports = cookRouter;
