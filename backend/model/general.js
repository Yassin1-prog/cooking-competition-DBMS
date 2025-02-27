const pool = require("../db.js");

const generalModel = {
  // Cuisine methods
  getAllCuisines: async () => {
    const [rows] = await pool.query(
      "SELECT cuisine_id as id, cuisine as name FROM cuisine"
    );
    return rows;
  },

  createCuisine: async (cuisineName) => {
    const query = `
      INSERT INTO cuisine (cuisine, image, caption)
      VALUES (?, ?, ?)
    `;
    // Generate random values for fields we don't care about
    const randomImage = `cuisine_image_${Date.now()}.jpg`;
    const randomCaption = `Caption for ${cuisineName}`;

    const [result] = await pool.query(query, [
      cuisineName,
      randomImage,
      randomCaption,
    ]);
    return result.insertId;
  },

  updateCuisine: async (id, cuisineName) => {
    const query = `
      UPDATE cuisine 
      SET cuisine = ?
      WHERE cuisine_id = ?
    `;

    const [result] = await pool.query(query, [cuisineName, id]);
    return result.affectedRows > 0;
  },

  deleteCuisine: async (id) => {
    const [result] = await pool.query(
      "DELETE FROM cuisine WHERE cuisine_id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },

  // Ingredient methods
  getAllIngredients: async () => {
    const [rows] = await pool.query(
      "SELECT ingredient_id as id, ingredient as name, calories FROM ingredient"
    );
    return rows;
  },

  createIngredient: async (name, calories) => {
    const query = `
      INSERT INTO ingredient (ingredient, calories, foodGroup_id, image, caption)
      VALUES (?, ?, ?, ?, ?)
    `;
    // Generate random values for fields we don't care about
    const randomFoodGroupId = 1; // Assuming there's at least one food group with ID 1
    const randomImage = `ingredient_image_${Date.now()}.jpg`;
    const randomCaption = `Caption for ${name}`;

    const [result] = await pool.query(query, [
      name,
      calories,
      randomFoodGroupId,
      randomImage,
      randomCaption,
    ]);
    return result.insertId;
  },

  updateIngredient: async (id, name, calories) => {
    const query = `
      UPDATE ingredient 
      SET ingredient = ?, calories = ?
      WHERE ingredient_id = ?
    `;

    const [result] = await pool.query(query, [name, calories, id]);
    return result.affectedRows > 0;
  },

  deleteIngredient: async (id) => {
    const [result] = await pool.query(
      "DELETE FROM ingredient WHERE ingredient_id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },

  // Tool methods
  getAllTools: async () => {
    const [rows] = await pool.query(
      "SELECT tool_id as id, tool_name as name FROM tool"
    );
    return rows;
  },

  createTool: async (name) => {
    const query = `
      INSERT INTO tool (tool_name, manual, image, caption)
      VALUES (?, ?, ?, ?)
    `;
    // Generate random values for fields we don't care about
    const randomManual = `How to use ${name}: Place the tool on a flat surface and follow manufacturer instructions.`;
    const randomImage = `tool_image_${Date.now()}.jpg`;
    const randomCaption = `Caption for ${name}`;

    const [result] = await pool.query(query, [
      name,
      randomManual,
      randomImage,
      randomCaption,
    ]);
    return result.insertId;
  },

  updateTool: async (id, name) => {
    const query = `
      UPDATE tool 
      SET tool_name = ?
      WHERE tool_id = ?
    `;

    const [result] = await pool.query(query, [name, id]);
    return result.affectedRows > 0;
  },

  deleteTool: async (id) => {
    const [result] = await pool.query("DELETE FROM tool WHERE tool_id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  },
};

module.exports = generalModel;
