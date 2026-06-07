import * as gameService from "../services/game.service.js";

export const getLiveMatches = (req, res) => {
  try {
    const liveMatches = gameService.getLiveMatches();
    res.json({ success: true, matches: liveMatches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
