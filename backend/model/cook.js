const pool = require("../db.js");

module.exports = {
  // Get list of cooks with basic info for cards
  getCooks: async () => {
    try {
      const [rows] = await pool.query(
        "SELECT cook_id, CONCAT(first_name, ' ', last_name) AS name, age, class FROM cook"
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get detailed cook info by id
  getCookById: async (cookId) => {
    try {
      // Get cook basic info
      const [cookInfo] = await pool.query(
        `SELECT 
          c.cook_id AS id, 
          CONCAT(c.first_name, ' ', c.last_name) AS name, 
          c.birth as birthDate, 
          c.age, 
          c.class, 
          c.phone, 
          c.years_of_experience AS experience
        FROM cook c
        WHERE c.cook_id = ?`,
        [cookId]
      );

      if (cookInfo.length === 0) {
        return null;
      }

      cookInfo[0].birthDate = extractDate(String(cookInfo[0].birthDate));

      // Get cuisines for this cook
      const [cuisines] = await pool.query(
        `SELECT 
          cui.cuisine
        FROM cuisine_cook cc
        JOIN cuisine cui ON cc.cuisine_id = cui.cuisine_id  
        WHERE cc.cook_id = ?`,
        [cookId]
      );

      // Count judge appearances
      const [judgeCount] = await pool.query(
        `SELECT 
          COUNT(*) AS judgeAppearances
        FROM judge
        WHERE cook_id = ?`,
        [cookId]
      );

      // Count cook appearances and wins
      const [cookAppearances] = await pool.query(
        `SELECT 
          COUNT(*) AS cookAppearances,
          SUM(winner = TRUE) AS wins
        FROM episode_recipe_cook
        WHERE cook_id = ?`,
        [cookId]
      );

      // Combine all data
      return {
        ...cookInfo[0],
        cuisines: cuisines.map((c) => c.cuisine),
        judgeAppearances: judgeCount[0].judgeAppearances || 0,
        cookAppearances: cookAppearances[0].cookAppearances || 0,
        wins: cookAppearances[0].wins || 0,
      };
    } catch (error) {
      throw error;
    }
  },

  // Create a new cook
  createCook: async (cookData, cuisineIds) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Calculate age from birth date
      const birthDate = new Date(cookData.birth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      // Insert cook with calculated age
      const [result] = await connection.query(
        `INSERT INTO cook 
          (first_name, last_name, birth, age, phone, years_of_experience, class, image, caption) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cookData.first_name,
          cookData.last_name,
          cookData.birth,
          age,
          cookData.phone,
          cookData.years_of_experience,
          cookData.class,
          cookData.image || "default-image.jpg", // Filler value for image
          cookData.caption || "No caption available", // Filler value for caption
        ]
      );

      const cookId = result.insertId;

      // Add cuisine associations
      if (cuisineIds && cuisineIds.length > 0) {
        const cuisineValues = cuisineIds.map((cuisineId) => [
          cuisineId,
          cookId,
        ]);
        await connection.query(
          "INSERT INTO cuisine_cook (cuisine_id, cook_id) VALUES ?",
          [cuisineValues]
        );
      }

      await connection.commit();
      return cookId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Update cook information
  updateCook: async (cookId, cookData, cuisineIds) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Calculate age if birth date is provided
      let age;
      if (cookData.birth) {
        const birthDate = new Date(cookData.birth);
        const today = new Date();
        age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
      }

      // Build update query dynamically based on provided fields
      let updateQuery = "UPDATE cook SET ";
      const updateParams = [];
      const updateFields = [];

      if (cookData.first_name) {
        updateFields.push("first_name = ?");
        updateParams.push(cookData.first_name);
      }

      if (cookData.last_name) {
        updateFields.push("last_name = ?");
        updateParams.push(cookData.last_name);
      }

      if (cookData.birth) {
        updateFields.push("birth = ?");
        updateParams.push(cookData.birth);
        updateFields.push("age = ?");
        updateParams.push(age);
      }

      if (cookData.phone) {
        updateFields.push("phone = ?");
        updateParams.push(cookData.phone);
      }

      if (cookData.years_of_experience) {
        updateFields.push("years_of_experience = ?");
        updateParams.push(cookData.years_of_experience);
      }

      if (cookData.class) {
        updateFields.push("class = ?");
        updateParams.push(cookData.class);
      }

      if (cookData.image) {
        updateFields.push("image = ?");
        updateParams.push(cookData.image);
      }

      if (cookData.caption) {
        updateFields.push("caption = ?");
        updateParams.push(cookData.caption);
      }

      // Only update if there are fields to update
      if (updateFields.length > 0) {
        updateQuery += updateFields.join(", ") + " WHERE cook_id = ?";
        updateParams.push(cookId);
        await connection.query(updateQuery, updateParams);
      }

      // Update cuisine associations if provided
      if (cuisineIds) {
        // Remove existing associations
        await connection.query("DELETE FROM cuisine_cook WHERE cook_id = ?", [
          cookId,
        ]);

        // Add new associations
        if (cuisineIds.length > 0) {
          const cuisineValues = cuisineIds.map((cuisineId) => [
            cuisineId,
            cookId,
          ]);
          await connection.query(
            "INSERT INTO cuisine_cook (cuisine_id, cook_id) VALUES ?",
            [cuisineValues]
          );
        }
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Delete a cook and related records
  deleteCook: async (cookId) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Delete from episode_recipe_cook
      await connection.query(
        "DELETE FROM episode_recipe_cook WHERE cook_id = ?",
        [cookId]
      );

      // Delete from judge
      await connection.query("DELETE FROM judge WHERE cook_id = ?", [cookId]);

      // Delete from cuisine_cook
      await connection.query("DELETE FROM cuisine_cook WHERE cook_id = ?", [
        cookId,
      ]);

      // Finally delete the cook
      await connection.query("DELETE FROM cook WHERE cook_id = ?", [cookId]);

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
};

function extractDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
