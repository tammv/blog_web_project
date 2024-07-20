import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Spinner, Button} from "flowbite-react";
import QuizResult from './QuizResult';

const QuizGame = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [questions, setQuestions] = useState(null);
  const [results, setResult] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { quizId } = useParams();

  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/quiz/${quizId}`);
        const data = await res.json();
        if (res.ok) {
          setQuestions(data.questions);
        } else {
          console.error(data.message);
          setError(data.message);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setError("An error occurred while fetching the quiz.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuizzes();
  }, [quizId]);


  const handleOptionChange = async (event) => {
    const { checked, value } = event.target;
    const isMultipleChoice = questions[currentQuestionIndex].correctAnswerIndex.length > 1;

    if (isMultipleChoice) {
      const updatedOptions = [...selectedOptions];
    
      if (checked) {
        updatedOptions.push(value);
      } else {
        const index = updatedOptions.indexOf(value);
        updatedOptions.splice(index, 1);
      }

      setSelectedOptions(updatedOptions);
    } else {

      const answerData = {
        _id: questions?.[currentQuestionIndex]._id,
        text: questions?.[currentQuestionIndex].text,
        options: questions?.[currentQuestionIndex].options,
        correctAnswerIndex: questions?.[currentQuestionIndex].correctAnswerIndex,
        level: questions?.[currentQuestionIndex].level,
        answers: checked ? value : null
      };

      setResult(results ? results.concat({answerData}) : [{answerData}]);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptions([]);
    }
  };

  const handleNextQuestion = async () => {
    
    const answerData = {
      _id: questions?.[currentQuestionIndex]._id,
      text: questions?.[currentQuestionIndex].text,
      options: questions?.[currentQuestionIndex].options,
      correctAnswerIndex: questions?.[currentQuestionIndex].correctAnswerIndex,
      level: questions?.[currentQuestionIndex].level,
      answers: selectedOptions
    };

    setResult(results ? results.concat({answerData}) : [{answerData}]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedOptions([]);
  };

  const currentQuestion = questions?.[currentQuestionIndex]; // Optional chaining to handle potential null

  return (
    <div className='flex justify-center p-6 m-6'>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="xl" />
        </div>
      ) : error ? (
        <p>Error: {error}</p>
      ) : currentQuestion ? (
        <div className='rounded-2xl bg-slate-300 p-3'>
          <h2>{currentQuestion.text}</h2>
          <ul>
            {currentQuestion.options.map((option, index) => (
              <li key={index}>
                <input
                  className='mr-2'
                  type={questions[currentQuestionIndex].correctAnswerIndex.length > 1 ? "checkbox" : "radio"}
                  id={`option-${index}`}
                  name={`option-${index}`}
                  value={option}
                  checked={selectedOptions.includes(option)}
                  onChange={handleOptionChange}
                />
                <label htmlFor={`option-${index}`}>{option}</label>
              </li>
            ))}
          </ul>
          {currentQuestion.correctAnswerIndex.length > 1 && <Button className='mt-4 w-full' onClick={handleNextQuestion}>Next Question</Button>}
        </div>
      ) : (
        <div className='flex flex-col'>
          <QuizResult results={results}/>
        </div>
      )}
    </div>
  );
};

export default QuizGame;