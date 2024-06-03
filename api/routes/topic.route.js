import express from 'express';
import {
  createTopic,
  getAllTopics,
  getTopicById,
  updateTopicById,
  deleteTopicById
} from "../controllers/topic.controller.js";

const router = express.Router();

router.post('/', createTopic);
router.get('/', getAllTopics);
router.get('/:id', getTopicById);
router.put('/:id', updateTopicById);
router.delete('/:id', deleteTopicById);

export default router;
