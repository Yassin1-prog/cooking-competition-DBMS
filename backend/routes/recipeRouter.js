const { Router } = require("express");

recipeRouter = Router();
const recipeController = require("../controllers/recipeController");

recipeRouter.get("/", recipeController.getRecipes);
recipeRouter.post("/create", recipeController.createRecipe);
recipeRouter.get("/:id", recipeController.getRecipe);
recipeRouter.post("/:id/update", recipeController.updateRecipe);
recipeRouter.post("/:id/delete", recipeController.deleteRecipe);

module.exports = recipeRouter;
