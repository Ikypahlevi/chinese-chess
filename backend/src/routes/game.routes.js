import express from "express";
import * as gameController from "../controllers/game.controller.js";

const router = express.Router();

router.get("/live-matches", gameController.getLiveMatches);

export default router;
