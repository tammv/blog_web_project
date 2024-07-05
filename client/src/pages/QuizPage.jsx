import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";

export default function QuizPage() {
    const [loading, setLoading] = useState(true);
    const [questionsData, setQuestionsData] = useState([]);

    useEffect(() => {
      console.log("Hello");
        const fetchQuizzes = async () => {
          try {
            setLoading(true);
            const res = await fetch("/api/quiz");
            const data = await res.json();
            if (res.ok) {
                const q = [];

              data.quizzes.forEach((quiz) => {
                quiz.questions.forEach((question) => {
                  q.push(question);
                });

                setQuestionsData(q);
            })
            } else {
              console.error(data.message);
            }
            setLoading(false);
          } catch (error) {
            console.error("Error fetching topics:", error);
            setLoading(false);
          }
        };
        
        fetchQuizzes();
    },[]);

    if (loading)
        return (
          <div className="flex justify-center items-center min-h-screen">
            <Spinner size="xl" />
          </div>
    );

    return (
    <div className="mt-6 py-10">

    </div>
  )
}
