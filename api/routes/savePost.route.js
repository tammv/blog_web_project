import express from "express";
import { savePost, getSavedPosts, getAllSavePost, removeSavedPost } from "../controllers/savePost.controller.js";

const router = express.Router();

router.post("/save", savePost);
router.get("/saved/:userId", getSavedPosts);
router.get("/getAllSaved/", getAllSavePost);
router.delete("/removeSavedPost/:savePostId", removeSavedPost);

export default router;
