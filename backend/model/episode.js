const pool = require("../db.js");

module.exports = {
  // Get list of episodes with basic info for cards
  getEpisodes: async () => {
    try {
      const [rows] = await pool.query(
        "SELECT episode_id, year_filmed FROM episode"
      );

      // Add random user rating between 0 and 10 for each episode
      return rows.map((episode) => ({
        ...episode,
        user_rating: Math.floor(Math.random() * 11), // Random integer between 0 and 10
      }));
    } catch (error) {
      throw error;
    }
  },

  // Get detailed episode info by id
  getEpisodeById: async (episodeId) => {
    try {
      // Get episode basic info
      const [episodeInfo] = await pool.query(
        `SELECT 
          episode_id, 
          year_filmed
        FROM episode
        WHERE episode_id = ?`,
        [episodeId]
      );

      if (episodeInfo.length === 0) {
        return null;
      }

      // Get featured cuisines, recipes, cooks and grades for this episode
      const [featuredItems] = await pool.query(
        `SELECT 
          c.cuisine_id,
          c.cuisine AS cuisine_name, 
          r.recipe_id,
          r.recipe_name,
          ck.cook_id,
          CONCAT(ck.first_name, ' ', ck.last_name) AS cook_name,
          erc.winner,
          (erc.grade1 + erc.grade2 + erc.grade3) / 3 AS average_grade
        FROM episode_recipe_cook erc
        JOIN cuisine c ON erc.cuisine_id = c.cuisine_id
        JOIN recipe r ON erc.recipe_id = r.recipe_id
        JOIN cook ck ON erc.cook_id = ck.cook_id
        WHERE erc.episode_id = ?`,
        [episodeId]
      );

      const formattedItems = featuredItems.map((item) => ({
        cuisine_id: item.cuisine_id,
        cuisine_name: item.cuisine_name,
        recipe_id: item.recipe_id,
        recipe_name: item.recipe_name,
        cook_id: item.cook_id,
        cook_name: item.cook_name,
        average_grade: parseFloat(item.average_grade).toFixed(2),
        winner: item.winner === 1,
      }));

      // Get judges for this episode
      const [judges] = await pool.query(
        `SELECT 
          j.position,
          CONCAT(c.first_name, ' ', c.last_name) AS judge_name,
          c.cook_id
        FROM judge j
        JOIN cook c ON j.cook_id = c.cook_id
        WHERE j.episode_id = ?
        ORDER BY j.position`,
        [episodeId]
      );

      // Combine all data
      return {
        ...episodeInfo[0],
        featuredItems: formattedItems,
        judges: judges.map((j) => ({
          cook_id: j.cook_id,
          judge_name: j.judge_name,
          position: j.position,
        })),
      };
    } catch (error) {
      throw error;
    }
  },
};
