import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Button } from "flowbite-react";
import Question from "../components/Question";

export default function FinalExamQuizz() {
  const [questions, setQuestions] = useState(null);
  const [index, setIndex] = useState(0);
  const { quizId } = useParams();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch(`/api/quiz/${quizId}`);
        const data = await res.json();
        if (res.ok) {
          setQuestions(data.questions);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchQuizzes();
  }, [quizId]);

  const handlePrev = () => {
    if(index > 0)
      setIndex(index-1);
  }

  const handleNext = () => {
    if(index < questions.length-1)
      setIndex(index+1);
  }

  return (
    <div className="flex justify-center p-6 m-6">
      {questions === null ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="xl" />
        </div>
      ) : (
        <div className="">
          <Question question={questions[index]} />
          <div className="flex justify-center gap-5">
            <Button onClick={handlePrev}>Prev</Button>
            <Button onClick={handleNext}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}

