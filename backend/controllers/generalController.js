const generalModel = require("../model/general");

const generalController = {
  // Cuisine controllers
  getCuisines: async (req, res) => {
    try {
      const cuisines = await generalModel.getAllCuisines();
      res.status(200).json({ success: true, data: cuisines });
    } catch (error) {
      console.error("Error getting cuisines:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to retrieve cuisines" });
    }
  },

  createCuisine: async (req, res) => {
    try {
      const { name } = req.body;

      if (!name) {
        return res
          .status(400)
          .json({ success: false, message: "Cuisine name is required" });
      }

      const id = await generalModel.createCuisine(name);
      res.status(201).json({ success: true, data: { id, name } });
    } catch (error) {
      console.error("Error creating cuisine:", error);
      // Check for duplicate entry error
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(409)
          .json({ success: false, message: "Cuisine already exists" });
      }
      res
        .status(500)
        .json({ success: false, message: "Failed to create cuisine" });
    }
  },

  updateCuisine: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) {
        return res
          .status(400)
          .json({ success: false, message: "Cuisine name is required" });
      }

      const success = await generalModel.updateCuisine(id, name);

      if (!success) {
        return res
          .status(404)
          .json({ success: false, message: "Cuisine not found" });
      }

      res.status(200).json({ success: true, data: { id, name } });
    } catch (error) {
      console.error("Error updating cuisine:", error);
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(409)
          .json({ success: false, message: "Cuisine name already exists" });
      }
      res
        .status(500)
        .json({ success: false, message: "Failed to update cuisine" });
    }
  },

  deleteCuisine: async (req, res) => {
    try {
      const { id } = req.params;

      const success = await generalModel.deleteCuisine(id);

      if (!success) {
        return res
          .status(404)
          .json({ success: false, message: "Cuisine not found" });
      }

      res
        .status(200)
        .json({ success: true, message: "Cuisine deleted successfully" });
    } catch (error) {
      console.error("Error deleting cuisine:", error);
      res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to delete cuisine, make sure to delete entities that depend on it first",
        });
    }
  },

  // Ingredient controllers
  getIngredients: async (req, res) => {
    try {
      const ingredients = await generalModel.getAllIngredients();
      res.status(200).json({ success: true, data: ingredients });
    } catch (error) {
      console.error("Error getting ingredients:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to retrieve ingredients" });
    }
  },

  createIngredient: async (req, res) => {
    try {
      const { name, calories } = req.body;

      if (!name || calories === undefined) {
        return res.status(400).json({
          success: false,
          message: "Ingredient name and calories are required",
        });
      }

      const id = await generalModel.createIngredient(name, calories);
      res.status(201).json({ success: true, data: { id, name, calories } });
    } catch (error) {
      console.error("Error creating ingredient:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to create ingredient" });
    }
  },

  updateIngredient: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, calories } = req.body;

      if (!name || calories === undefined) {
        return res.status(400).json({
          success: false,
          message: "Ingredient name and calories are required",
        });
      }

      const success = await generalModel.updateIngredient(id, name, calories);

      if (!success) {
        return res
          .status(404)
          .json({ success: false, message: "Ingredient not found" });
      }

      res.status(200).json({ success: true, data: { id, name, calories } });
    } catch (error) {
      console.error("Error updating ingredient:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update ingredient" });
    }
  },

  deleteIngredient: async (req, res) => {
    try {
      const { id } = req.params;

      const success = await generalModel.deleteIngredient(id);

      if (!success) {
        return res
          .status(404)
          .json({ success: false, message: "Ingredient not found" });
      }

      res
        .status(200)
        .json({ success: true, message: "Ingredient deleted successfully" });
    } catch (error) {
      console.error("Error deleting ingredient:", error);
      res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to delete ingredient, make sure to delete entities that depend on it first",
        });
    }
  },

  // Tool controllers
  getTools: async (req, res) => {
    try {
      const tools = await generalModel.getAllTools();
      res.status(200).json({ success: true, data: tools });
    } catch (error) {
      console.error("Error getting tools:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to retrieve tools" });
    }
  },

  createTool: async (req, res) => {
    try {
      const { name } = req.body;

      if (!name) {
        return res
          .status(400)
          .json({ success: false, message: "Tool name is required" });
      }

      const id = await generalModel.createTool(name);
      res.status(201).json({ success: true, data: { id, name } });
    } catch (error) {
      console.error("Error creating tool:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to create tool" });
    }
  },

  updateTool: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) {
        return res
          .status(400)
          .json({ success: false, message: "Tool name is required" });
      }

      const success = await generalModel.updateTool(id, name);

      if (!success) {
        return res
          .status(404)
          .json({ success: false, message: "Tool not found" });
      }

      res.status(200).json({ success: true, data: { id, name } });
    } catch (error) {
      console.error("Error updating tool:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update tool" });
    }
  },

  deleteTool: async (req, res) => {
    try {
      const { id } = req.params;

      const success = await generalModel.deleteTool(id);

      if (!success) {
        return res
          .status(404)
          .json({ success: false, message: "Tool not found" });
      }

      res
        .status(200)
        .json({ success: true, message: "Tool deleted successfully" });
    } catch (error) {
      console.error("Error deleting tool:", error);
      res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to delete tool, make sure to delete entities that depend on it first",
        });
    }
  },
};

module.exports = generalController;
