import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Spinner, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiClipboardList } from "react-icons/hi";

function HighlightedText({ text, highlight }) {
    if (!highlight.trim()) {
        return <span>{text}</span>;
    }

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);

    return (
        <span>
            {parts.map((part, index) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <span key={index} className="bg-yellow-200">
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
        </span>
    );
}

export default function QuizPage() {
    const { currentUser } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [quizzesData, setQuizzesData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

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

    const filteredQuizzes = quizzesData.filter((quiz) =>
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="flex flex-col max-w-6xl mx-auto p-5">
          <div className="flex flex-auto justify-center gap-10 backdrop-blur-lg mb-2">
          {currentUser && (currentUser.isPremium || currentUser.isAdmin) ? (
            <Link to="/create-quiz"> 
              <Button className="bg-blue-700 hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-500 flex justify-between text-center items-center">
                <HiClipboardList className="mr-2"/> 
                <p> Create Quizz </p>
              </Button>
            </Link>
            ) : null
          }
          {currentUser && currentUser.isAdmin ? 
          (
            <Link to="/dashboardadmin?tab=quizzesadmin"> 
              <Button className="bg-orange-500 hover:bg-gradient-to-r hover:from-violet-800 hover:to-blue-500 flex justify-between text-center items-center">
                <HiClipboardList className="mr-2"/> 
                <p> Manager Quizz </p>
              </Button>
            </Link>
          ) : 
          (
            <Link to="/dashboard?tab=quizzes"> 
            <Button className="bg-orange-500 hover:bg-gradient-to-r hover:from-violet-800 hover:to-blue-500 flex justify-between text-center items-center">
              <HiClipboardList className="mr-2"/> 
              <p> Your Quizz </p>
            </Button>
          </Link>
          )}
          </div>
            <input
                type="text"
                placeholder="Search quizzes by title"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <div className="pr-10 py-6 pl-9 w-full flex flex-col gap-4">
                {filteredQuizzes.length > 0 ? (
                    filteredQuizzes.map((quiz) => (
                        <div className="gap-6" key={quiz._id}>
                            <Link to={`${quiz._id}`}>
                                <div className="backdrop-brightness-125 bg-white/30 rounded-lg shadow-md overflow-hidden">
                                    <div className="p-4">
                                        <h2 className="text-xl font-bold text-gray-800 hover:text-gray-600">
                                            <HighlightedText text={quiz.title} highlight={searchQuery} />
                                        </h2>
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
                    ))
                ) : (
                    <div className="text-center">Quiz not found</div>
                )}
            </div>
        </main>
    );
}
