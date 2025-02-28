const pool = require("../db.js");

const recipeModel = {
  // Get all recipes with basic info for cards
  getAllRecipes: async () => {
    const query = `
      SELECT 
        r.recipe_id, 
        r.recipe_name, 
        r.category, 
        c.cuisine as cuisine_name, 
        r.difficulity
      FROM 
        recipe r
      JOIN 
        cuisine c ON r.cuisine_id = c.cuisine_id
      ORDER BY recipe_id DESC
    `;

    const [rows] = await pool.query(query);
    return rows;
  },

  // Get a single recipe with all details
  getRecipeById: async (id) => {
    // Get basic recipe info
    const recipeQuery = `
      SELECT 
        r.recipe_id as id, 
        r.recipe_name as name, 
        r.descr as description, 
        r.category, 
        c.cuisine as cuisine_name, 
        r.difficulity,
        r.steps
      FROM 
        recipe r
      JOIN 
        cuisine c ON r.cuisine_id = c.cuisine_id
      WHERE 
        r.recipe_id = ?
    `;

    // Get nutrition info
    const nutritionQuery = `
      SELECT 
        calories_per_serving, 
        carbs_per_servning, 
        fat_per_serving, 
        protein_per_serving
      FROM 
        nutrition
      WHERE 
        recipe_id = ?
    `;

    // Get ingredients with their amounts
    const ingredientsQuery = `
      SELECT 
        i.ingredient_id, 
        i.ingredient as name, 
        ri.amount
      FROM 
        recipe_ingredient ri
      JOIN 
        ingredient i ON ri.ingredient_id = i.ingredient_id
      WHERE 
        ri.recipe_id = ?
    `;

    // Get tools
    const toolsQuery = `
      SELECT 
        t.tool_id, 
        t.tool_name as name
      FROM 
        recipe_tool rt
      JOIN 
        tool t ON rt.tool_id = t.tool_id
      WHERE 
        rt.recipe_id = ?
    `;

    // Count occurrences in episodes
    const episodesCountQuery = `
      SELECT 
        COUNT(*) as episode_count
      FROM 
        episode_recipe_cook
      WHERE 
        recipe_id = ?
    `;

    // Execute all queries in parallel
    const [
      recipeRows,
      nutritionRows,
      ingredientRows,
      toolRows,
      episodeCountRows,
    ] = await Promise.all([
      pool.query(recipeQuery, [id]),
      pool.query(nutritionQuery, [id]),
      pool.query(ingredientsQuery, [id]),
      pool.query(toolsQuery, [id]),
      pool.query(episodesCountQuery, [id]),
    ]);

    // If recipe doesn't exist, return null
    if (recipeRows[0].length === 0) {
      return null;
    }

    // Combine all data
    const recipe = recipeRows[0][0];
    recipe.nutrition = nutritionRows[0][0] || null;
    recipe.ingredients = ingredientRows[0] || [];
    recipe.tools = toolRows[0] || [];
    recipe.episodeAppearances = episodeCountRows[0][0].episode_count;

    return recipe;
  },

  // Create a new recipe with all related data
  createRecipe: async (recipeData) => {
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Insert recipe basic info
      const recipeQuery = `
        INSERT INTO recipe (
          recipe_name, 
          descr, 
          cuisine_id, 
          theme_id, 
          difficulity, 
          quantity, 
          category, 
          steps, 
          image, 
          caption
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // Use a default theme_id of 1, default quantity of 4, default image and caption
      const defaultThemeId = 1;
      const defaultQuantity = 4;
      const defaultImage = `recipe_image_${Date.now()}.jpg`;
      const defaultCaption = `A delicious ${recipeData.recipe_name} recipe`;

      const [recipeResult] = await connection.query(recipeQuery, [
        recipeData.recipe_name,
        recipeData.description,
        recipeData.cuisine_id,
        defaultThemeId,
        recipeData.difficulity,
        defaultQuantity,
        recipeData.category,
        recipeData.steps,
        defaultImage,
        defaultCaption,
      ]);

      const recipeId = recipeResult.insertId;

      // Insert nutrition information
      const nutritionQuery = `
        INSERT INTO nutrition (
          recipe_id, 
          calories_per_serving, 
          carbs_per_servning, 
          fat_per_serving, 
          protein_per_serving
        ) VALUES (?, ?, ?, ?, ?)
      `;

      await connection.query(nutritionQuery, [
        recipeId,
        recipeData.nutrition.calories,
        recipeData.nutrition.carbs,
        recipeData.nutrition.fat,
        recipeData.nutrition.protein,
      ]);

      // Insert ingredients
      if (recipeData.ingredients && recipeData.ingredients.length > 0) {
        const ingredientValues = recipeData.ingredients.map((ingredient) => [
          recipeId,
          ingredient.ingredient_id,
          ingredient.amount,
          ingredient.main_ingredient || false,
        ]);

        const ingredientQuery = `
          INSERT INTO recipe_ingredient (
            recipe_id, 
            ingredient_id, 
            amount, 
            main_ingredient
          ) VALUES ?
        `;

        await connection.query(ingredientQuery, [ingredientValues]);
      }

      // Insert tools
      if (recipeData.tools && recipeData.tools.length > 0) {
        const toolValues = recipeData.tools.map((toolId) => [recipeId, toolId]);

        const toolQuery = `
          INSERT INTO recipe_tool (
            recipe_id, 
            tool_id
          ) VALUES ?
        `;

        await connection.query(toolQuery, [toolValues]);
      }

      // Commit the transaction
      await connection.commit();

      return recipeId;
    } catch (error) {
      // Rollback on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Update an existing recipe
  updateRecipe: async (id, recipeData) => {
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Update recipe basic info
      const recipeQuery = `
        UPDATE recipe SET 
          recipe_name = ?, 
          descr = ?, 
          cuisine_id = ?, 
          difficulity = ?, 
          category = ?, 
          steps = ?
        WHERE recipe_id = ?
      `;

      const [recipeResult] = await connection.query(recipeQuery, [
        recipeData.recipe_name,
        recipeData.description,
        recipeData.cuisine_id,
        recipeData.difficulity,
        recipeData.category,
        recipeData.steps,
        id,
      ]);

      // If recipe doesn't exist, throw error
      if (recipeResult.affectedRows === 0) {
        throw new Error("Recipe not found");
      }

      // Update nutrition information
      const nutritionQuery = `
        UPDATE nutrition SET 
          calories_per_serving = ?, 
          carbs_per_servning = ?, 
          fat_per_serving = ?, 
          protein_per_serving = ?
        WHERE recipe_id = ?
      `;

      await connection.query(nutritionQuery, [
        recipeData.nutrition.calories,
        recipeData.nutrition.carbs,
        recipeData.nutrition.fat,
        recipeData.nutrition.protein,
        id,
      ]);

      // Update ingredients (delete all and insert new ones)
      if (recipeData.ingredients) {
        // Delete existing ingredients
        await connection.query(
          "DELETE FROM recipe_ingredient WHERE recipe_id = ?",
          [id]
        );

        // Insert new ingredients
        if (recipeData.ingredients.length > 0) {
          const ingredientValues = recipeData.ingredients.map((ingredient) => [
            id,
            ingredient.ingredient_id,
            ingredient.amount,
            ingredient.main_ingredient || false,
          ]);

          const ingredientQuery = `
            INSERT INTO recipe_ingredient (
              recipe_id, 
              ingredient_id, 
              amount, 
              main_ingredient
            ) VALUES ?
          `;

          await connection.query(ingredientQuery, [ingredientValues]);
        }
      }

      // Update tools (delete all and insert new ones)
      if (recipeData.tools) {
        // Delete existing tools
        await connection.query("DELETE FROM recipe_tool WHERE recipe_id = ?", [
          id,
        ]);

        // Insert new tools
        if (recipeData.tools.length > 0) {
          const toolValues = recipeData.tools.map((toolId) => [id, toolId]);

          const toolQuery = `
            INSERT INTO recipe_tool (
              recipe_id, 
              tool_id
            ) VALUES ?
          `;

          await connection.query(toolQuery, [toolValues]);
        }
      }

      // Commit the transaction
      await connection.commit();

      return true;
    } catch (error) {
      // Rollback on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Delete a recipe and all related data
  deleteRecipe: async (id) => {
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Check if recipe exists in episode_recipe_cook
      const [episodeRows] = await connection.query(
        "SELECT COUNT(*) as count FROM episode_recipe_cook WHERE recipe_id = ?",
        [id]
      );

      if (episodeRows[0].count > 0) {
        // Delete from episode_recipe_cook
        await connection.query(
          "DELETE FROM episode_recipe_cook WHERE recipe_id = ?",
          [id]
        );
      }

      // Delete from recipe_ingredient
      await connection.query(
        "DELETE FROM recipe_ingredient WHERE recipe_id = ?",
        [id]
      );

      // Delete from recipe_tool
      await connection.query("DELETE FROM recipe_tool WHERE recipe_id = ?", [
        id,
      ]);

      // Delete from nutrition
      await connection.query("DELETE FROM nutrition WHERE recipe_id = ?", [id]);

      // Finally delete the recipe
      const [result] = await connection.query(
        "DELETE FROM recipe WHERE recipe_id = ?",
        [id]
      );

      // Check if recipe was deleted
      if (result.affectedRows === 0) {
        throw new Error("Recipe not found");
      }

      // Commit the transaction
      await connection.commit();

      return true;
    } catch (error) {
      // Rollback on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
};

module.exports = recipeModel;
