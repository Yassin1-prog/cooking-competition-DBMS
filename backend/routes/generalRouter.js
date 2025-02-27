const { Router } = require("express");

generalRouter = Router();
const generalController = require("../controllers/generalController");

// cuisines
generalRouter.get("/cuisines", generalController.getCuisines);
generalRouter.post("/cuisines/create", generalController.createCuisine);
generalRouter.post("/cuisines/:id/update", generalController.updateCuisine);
generalRouter.post("/cuisines/:id/delete", generalController.deleteCuisine);

//ingredients
generalRouter.get("/ingredients", generalController.getIngredients);
generalRouter.post("/ingredients/create", generalController.createIngredient);
generalRouter.post(
  "/ingredients/:id/update",
  generalController.updateIngredient
);
generalRouter.post(
  "/ingredients/:id/delete",
  generalController.deleteIngredient
);

//tools
generalRouter.get("/tools", generalController.getTools);
generalRouter.post("/tools/create", generalController.createTool);
generalRouter.post("/tools/:id/update", generalController.updateTool);
generalRouter.post("/tools/:id/delete", generalController.deleteTool);

module.exports = generalRouter;
