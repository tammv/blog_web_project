import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Spinner, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiClipboardList } from "react-icons/hi";

export default function QuizPage() {
    const { currentUser } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [quizzesData, setQuizzesData] = useState([{}]);

    useEffect(() => {
        const fetchQuizzes = async () => {
          try {
            setLoading(true);
            const res = await fetch(`/api/quiz`);
            const data = await res.json();
            if (res.ok) {
              setQuizzesData(data.quizzes)
              console.log(data.quizzes);
            } else {
              console.error(data.message);
            }
            setLoading(false);
          } catch (error) {
            console.error("Error fetching quizz:", error);
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
      <main className="flex flex-col max-w-3xl mx-auto p-5">
        <h1 className="text-3xl text-center font-bold mb-10">All Quizzes</h1>
        <div className="flex flex-auto justify-center gap-10 backdrop-blur-lg">
          {currentUser && (currentUser.isPremium || currentUser.isAdmin) ? (
            <Button>
              <Link className="flex items-center gap-2" to="/create-quiz"> 
              <HiClipboardList/> Create Quizz </Link>
            </Button>) : null
          }
          {currentUser && currentUser.isAdmin ? 
          (<Button><Link className="flex items-center gap-2" to="/dashboardadmin?tab=quizzesadmin"><HiClipboardList/>Manager Quizz</Link></Button>) : 
          (<Button><Link className="flex items-center gap-2" to="/dashboard?tab=quizzes"><HiClipboardList/>Your Quizz</Link></Button>)}
        </div>
        <div className="pr-10 py-6 pl-9 w-full flex flex-col gap-4">
          {quizzesData.map((quiz) => (
              <div className="gap-6" key={quiz._id}>
                <Link to={`${quiz._id}`}>
                  <div className="backdrop-brightness-125 bg-white/30 rounded-lg shadow-md overflow-hidden">
                    <div className="p-4">
                      <h2 className="text-xl font-bold text-gray-800 hover:text-gray-600"> {quiz.title} </h2>
                      <p className="text-base text-gray-500">{quiz.description}</p>
                      {quiz.topicID && (
                        <p className="text-sm text-gray-500 mt-2">
                          Topic: {quiz.topicID.nameOfTopic}
                        </p>
                      )}
                      {quiz.questions && quiz.questions.length >= 0 && (
                        <p className="text-sm text-gray-500 mt-2">
                          Number of Questions: {quiz.questions.length}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </main>
  )
}
