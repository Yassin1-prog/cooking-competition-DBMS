const { Router } = require("express");

episodeRouter = Router();
const episodeController = require("../controllers/episodeController");

episodeRouter.get("/", episodeController.getEpisodes);
episodeRouter.get("/:id", episodeController.getEpisode);

module.exports = episodeRouter;
