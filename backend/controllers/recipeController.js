const recipeModel = require("../model/recipe");

const recipeController = {
  // Get all recipes (for recipe cards)
  getRecipes: async (req, res) => {
    try {
      const recipes = await recipeModel.getAllRecipes();
      res.status(200).json({ success: true, data: recipes });
    } catch (error) {
      console.error("Error getting recipes:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to retrieve recipes" });
    }
  },

  // Get a specific recipe with all details
  getRecipe: async (req, res) => {
    try {
      const { id } = req.params;

      const recipe = await recipeModel.getRecipeById(id);

      if (!recipe) {
        return res
          .status(404)
          .json({ success: false, message: "Recipe not found" });
      }

      res.status(200).json({ success: true, data: recipe });
    } catch (error) {
      console.error("Error getting recipe:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to retrieve recipe" });
    }
  },

  // Create a new recipe
  createRecipe: async (req, res) => {
    try {
      const {
        recipe_name,
        description,
        cuisine_id,
        difficulity,
        category,
        steps,
        nutrition,
        ingredients,
        tools,
      } = req.body;

      // Validate required fields
      if (
        !recipe_name ||
        !description ||
        !cuisine_id ||
        !difficulity ||
        !category ||
        !steps
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required recipe fields",
        });
      }

      // Validate nutrition
      if (
        !nutrition ||
        !nutrition.calories ||
        !nutrition.carbs ||
        !nutrition.fat ||
        !nutrition.protein
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required nutrition fields",
        });
      }

      // Validate ingredients
      if (
        !ingredients ||
        !Array.isArray(ingredients) ||
        ingredients.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "At least one ingredient is required",
        });
      }

      for (const ingredient of ingredients) {
        if (!ingredient.ingredient_id || !ingredient.amount) {
          return res.status(400).json({
            success: false,
            message: "Each ingredient must have an ID and amount",
          });
        }
      }

      // Create the recipe
      const recipeId = await recipeModel.createRecipe({
        recipe_name,
        description,
        cuisine_id,
        difficulity,
        category,
        steps,
        nutrition,
        ingredients,
        tools: tools || [],
      });

      res.status(201).json({
        success: true,
        message: "Recipe created successfully",
        data: { id: recipeId },
      });
    } catch (error) {
      console.error("Error creating recipe:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to create recipe" });
    }
  },

  // Update an existing recipe
  updateRecipe: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        recipe_name,
        description,
        cuisine_id,
        difficulity,
        category,
        steps,
        nutrition,
        ingredients,
        tools,
      } = req.body;

      // Validate required fields
      if (
        !recipe_name ||
        !description ||
        !cuisine_id ||
        !difficulity ||
        !category ||
        !steps
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required recipe fields",
        });
      }

      // Validate nutrition
      if (
        !nutrition ||
        !nutrition.calories ||
        !nutrition.carbs ||
        !nutrition.fat ||
        !nutrition.protein
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required nutrition fields",
        });
      }

      // Validate ingredients
      if (
        !ingredients ||
        !Array.isArray(ingredients) ||
        ingredients.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "At least one ingredient is required",
        });
      }

      for (const ingredient of ingredients) {
        if (!ingredient.ingredient_id || !ingredient.amount) {
          return res.status(400).json({
            success: false,
            message: "Each ingredient must have an ID and amount",
          });
        }
      }

      // Update the recipe
      await recipeModel.updateRecipe(id, {
        recipe_name,
        description,
        cuisine_id,
        difficulity,
        category,
        steps,
        nutrition,
        ingredients,
        tools: tools || [],
      });

      res.status(200).json({
        success: true,
        message: "Recipe updated successfully",
      });
    } catch (error) {
      console.error("Error updating recipe:", error);

      if (error.message === "Recipe not found") {
        return res
          .status(404)
          .json({ success: false, message: "Recipe not found" });
      }

      res
        .status(500)
        .json({ success: false, message: "Failed to update recipe" });
    }
  },

  // Delete a recipe
  deleteRecipe: async (req, res) => {
    try {
      const { id } = req.params;

      await recipeModel.deleteRecipe(id);

      res.status(200).json({
        success: true,
        message: "Recipe deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting recipe:", error);

      if (error.message === "Recipe not found") {
        return res
          .status(404)
          .json({ success: false, message: "Recipe not found" });
      }

      res
        .status(500)
        .json({ success: false, message: "Failed to delete recipe" });
    }
  },
};

module.exports = recipeController;
