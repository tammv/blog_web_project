import express from "express";
import {
  createTopic,
  getAllTopics,
  getTopicById,
  updateTopicById,
  deleteTopicById,
  addUserToTopic,
  removeUserFromTopic
} from "../controllers/topic.controller.js";

const router = express.Router();

router.get("/", getAllTopics);
router.post("/create", createTopic);
router.get("/:id", getTopicById);
router.put("/:id", updateTopicById);
router.delete("/:id", deleteTopicById);
router.post("/:id/addUser", addUserToTopic);
// Add this route in your topic routes file
router.post('/:id/removeUser', removeUserFromTopic);

export default router;
