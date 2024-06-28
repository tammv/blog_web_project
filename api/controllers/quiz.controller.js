import Quiz from "../models/quiz.model.js"

export const getQuiz = async (req, res, next) => {
    const quizzes = await Quiz.find();
    res.status(200).json({
        quizzes
    })
}