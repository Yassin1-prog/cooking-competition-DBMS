const cookModel = require("../model/cook");

module.exports = {
  // Get list of all cooks (for displaying cards)
  getCooks: async (req, res) => {
    try {
      const cooks = await cookModel.getCooks();
      res.status(200).json({
        status: "success",
        data: cooks,
      });
    } catch (error) {
      console.error("Error getting cooks:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to retrieve cooks",
        error: error.message,
      });
    }
  },

  // Get detailed information about a specific cook
  getCook: async (req, res) => {
    try {
      const cookId = req.params.id;
      const cook = await cookModel.getCookById(cookId);

      if (!cook) {
        return res.status(404).json({
          status: "error",
          message: "Cook not found",
        });
      }

      res.status(200).json({
        status: "success",
        data: cook,
      });
    } catch (error) {
      console.error("Error getting cook details:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to retrieve cook details",
        error: error.message,
      });
    }
  },

  // Create a new cook
  createCook: async (req, res) => {
    try {
      const cookData = req.body;
      const cuisineIds = req.body.cuisines || [];

      // Validate required fields
      if (
        !cookData.first_name ||
        !cookData.last_name ||
        !cookData.birth ||
        !cookData.phone ||
        !cookData.years_of_experience ||
        !cookData.class
      ) {
        return res.status(400).json({
          status: "error",
          message: "Missing required fields",
        });
      }

      const cookId = await cookModel.createCook(cookData, cuisineIds);

      res.status(201).json({
        status: "success",
        message: "Cook created successfully",
        data: { cookId },
      });
    } catch (error) {
      console.error("Error creating cook:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to create cook",
        error: error.message,
      });
    }
  },

  // Update an existing cook
  updateCook: async (req, res) => {
    try {
      const cookId = req.params.id;
      const cookData = req.body;
      const cuisineIds = req.body.cuisines;

      // Check if cook exists
      const existingCook = await cookModel.getCookById(cookId);
      if (!existingCook) {
        return res.status(404).json({
          status: "error",
          message: "Cook not found",
        });
      }

      const success = await cookModel.updateCook(cookId, cookData, cuisineIds);

      res.status(200).json({
        status: "success",
        message: "Cook updated successfully",
      });
    } catch (error) {
      console.error("Error updating cook:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to update cook",
        error: error.message,
      });
    }
  },

  // Delete a cook and related records
  deleteCook: async (req, res) => {
    try {
      const cookId = req.params.id;

      // Check if cook exists
      const existingCook = await cookModel.getCookById(cookId);
      if (!existingCook) {
        return res.status(404).json({
          status: "error",
          message: "Cook not found",
        });
      }

      const success = await cookModel.deleteCook(cookId);

      res.status(200).json({
        status: "success",
        message: "Cook deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting cook:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to delete cook",
        error: error.message,
      });
    }
  },
};
