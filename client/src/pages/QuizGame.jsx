import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Spinner} from "flowbite-react";
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
        console.error("Error fetching quizz:", error);
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
        <div className="max-w-5xl h-full">
          <div className="select-none w-full h-full">
            <div className="rounded-2xl bg-slate-300 p-3 flex flex-col">
              <div className="rounded-2xl bg-purple-900 px-6 py-3 text-white flex-grow items-center">
                <h2 className="text-center">{currentQuestion.text}</h2>
              </div>
              <div className="flex justify-start w-24 items-center m-2">
                <p className='rounded-lg bg-red-600 px-1 py-1 text-white text-sm text-center flex-grow'>{currentQuestion.correctAnswerIndex.length} Answer</p>
              </div>
              <div className="rounded-2xl w-full mt-1 p-2">
                <ul className="flex flex-col gap-6">
                  {currentQuestion.options.map((option, index) => (
                    <li className="flex items-center gap-2 w-full" key={index}>
                      <input
                        type={questions[currentQuestionIndex].correctAnswerIndex.length > 1 ? "checkbox" : "radio"}
                        id={`option-${index}`}
                        name={`option-${index}`}
                        value={option}
                        checked={selectedOptions.includes(option)}
                        onChange={handleOptionChange}
                        className="mr-2 rounded focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      />
                      <label className="pt-0 text-base font-medium w-full h-full" htmlFor={`option-${index}`}>{option}</label>
                    </li>
                  ))}
                </ul>
                {currentQuestion.correctAnswerIndex.length > 1 && (
                  <button className="mt-4 w-full bg-indigo-600 text-white rounded-lg py-2 px-4 font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={handleNextQuestion}>
                    Next Question
                  </button>
                )}
              </div>
            </div>
          </div>
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