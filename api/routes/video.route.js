import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createVideo, getVideos, deleteVideo, updateVideo, getVideoById } from "../controllers/video.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createVideo);
router.get("/getVideos", getVideos);
router.get("/getVideo/:videoId", getVideoById);
router.delete("/deleteVideo/:videoId/:userId", verifyToken, deleteVideo);
router.put("/updateVideo/:videoId/:userId", verifyToken, updateVideo);

export default router;
