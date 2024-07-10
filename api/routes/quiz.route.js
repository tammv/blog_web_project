import express from "express";
import {getAllQuiz, getQuizById, createQuiz, createQuestion, updateQuizById, updateQuestionById, deleteQuizById, deleteQuizByUser, deleteQuestionById} from "../controllers/quiz.controller.js"
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get('/', getAllQuiz);
router.get('/:quizId', getQuizById);

router.post('/create', verifyToken, createQuiz);
router.post('/:quizId/question', verifyToken, createQuestion);

router.put('/:quizId', verifyToken, updateQuizById);
router.put('/:quizId/question/:questionId', verifyToken, updateQuestionById);

router.delete('/:quizId', verifyToken, deleteQuizById);
router.delete('/:quizId/:userId', verifyToken, deleteQuizByUser);
router.delete('/:quizId/question/:questionId', verifyToken, deleteQuestionById);

export default router;