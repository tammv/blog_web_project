import express from "express";
import {getQuiz} from "../controllers/quiz.controller.js"

const router = express.Router();
router.get('/', getQuiz);
export default router;