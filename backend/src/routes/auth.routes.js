import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import * as authController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/user", verifyToken, authController.getUser);
router.put("/profile", verifyToken, authController.updateProfile);
router.put("/brightness", verifyToken, authController.updateBrightness);
router.put("/sound", verifyToken, authController.updateSound);
router.put("/auto-play", verifyToken, authController.updateAutoPlay);
router.get("/leaderboard", authController.getLeaderboard);
router.post("/logout", verifyToken, authController.logout);

export default router;
