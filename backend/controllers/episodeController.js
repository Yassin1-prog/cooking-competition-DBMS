const episodeModel = require("../model/episode");

module.exports = {
  // Get list of all episodes (for displaying cards)
  getEpisodes: async (req, res) => {
    try {
      const episodes = await episodeModel.getEpisodes();
      res.status(200).json({
        status: "success",
        data: episodes,
      });
    } catch (error) {
      console.error("Error getting episodes:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to retrieve episodes",
        error: error.message,
      });
    }
  },

  // Get detailed information about a specific episode
  getEpisode: async (req, res) => {
    try {
      const episodeId = req.params.id;
      const episode = await episodeModel.getEpisodeById(episodeId);

      if (!episode) {
        return res.status(404).json({
          status: "error",
          message: "Episode not found",
        });
      }

      res.status(200).json({
        status: "success",
        data: episode,
      });
    } catch (error) {
      console.error("Error getting episode details:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to retrieve episode details",
        error: error.message,
      });
    }
  },
};
