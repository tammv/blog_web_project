import express from 'express';
import {
  createComment,
  getAllComments,
  getCommentById,
  updateCommentById,
  deleteCommentById
} from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/', createComment);
router.get('/', getAllComments);
router.get('/:id', getCommentById);
router.put('/:id', updateCommentById);
router.delete('/:id', deleteCommentById);

export default router;
