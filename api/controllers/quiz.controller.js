import Quiz from "../models/quiz.model.js";
import Question from "../models/question.model.js";
import { errorHandler } from "../utils/error.js";

export const getAllQuiz = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find().populate('questions');
    res.status(200).json({ quizzes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching quizzes' });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate('questions').populate('topicID');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createQuiz = async (req, res) => {
  if (!req.user) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }
  if (!req.body.topicID || !req.body.title || !req.body.description) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  try {
    console.log(req.body);
    const newQuiz = new Quiz({
      ...req.body,
      userId: req.user.id
    });
    const savedQuiz = await newQuiz.save();
    res.status(201)
        .json(savedQuiz);
  } catch (error) {
    res.status(400)
      .json({ message: error.message });
  }

};

export const createQuestion = async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    const savedQuestion = await newQuestion.save();

    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }
    quiz.questions.push(savedQuestion._id);
      await quiz.save();

    res.status(201)
        .json(savedQuestion);
  } catch (error) {
    res.status(400)
        .json({ message: error.message });
  }
};

export const updateQuizById = async (req, res) => {
    try {
      console.log(req.params.quizId);
      const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.quizId, req.body, { new: true, runValidators: true });
      if (!updatedQuiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      res.status(200).json(updatedQuiz);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};

export const updateQuestionById = async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(req.params.questionId, req.body, { new: true, runValidators: true });
    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteQuizById = async (req, res) => {
    try {
      const deletedQuiz = await Quiz.findByIdAndDelete(req.params.quizId);
      if (!deletedQuiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

export const deleteQuestionById = async (req, res) => {
  Quiz.findById(req.params.quizId)
    .then((quiz) => {
        if (quiz != null && quiz.questions.find(question => question._id.toString() === req.params.questionId) != null) {
          quiz.questions.pull(quiz.questions.find(question => question._id.toString() === req.params.questionId));
          console.log(quiz);
          quiz.save()
          .then(() => {
              Question.findByIdAndDelete(req.params.questionId)
                .then((question) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(question); 
                }, (err) => res.status(400).json({message: err.message}))           
          }, (err) => res.status(400).json({message: err.message}))
        }
        else if (quiz == null) {
            err = new Error('Quizzes ' + req.params.quizId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Questions ' + req.params.questionId + ' not found');
            err.status = 404;
            return next(err);         
        }
    }, (err) => res.status(400).json({message: err.message}))
    .catch((err) => res.status(400).json({message: err.message}));
}