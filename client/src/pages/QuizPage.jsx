import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Spinner, Sidebar } from "flowbite-react";
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
            const res = await fetch(`/api/quiz/?userId=${currentUser._id}`);
            const data = await res.json();
            if (res.ok) {
              setQuizzesData(data.quizzes)
              console.log(data.quizzes);
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
    },[currentUser._id]);

    if (loading)
        return (
          <div className="flex justify-center items-center min-h-screen">
            <Spinner size="xl" />
          </div>
    );
    

    return (
      <div className="flex gap-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="pl-6 py-6">
          <Sidebar className="w-full md:w-60">
            <Sidebar.Items>
              <Sidebar.ItemGroup className="flex flex-col gap-1">
                <Link to="/create-quiz">
                  <Sidebar.Item icon={HiClipboardList} as="div">
                    Create Quizz
                  </Sidebar.Item>
                </Link>
                {currentUser && currentUser.isAdmin ? (
                <Link to="/dashboardadmin?tab=quizzesadmin">
                  <Sidebar.Item icon={HiClipboardList} as="div">
                    Manager Quizz
                  </Sidebar.Item>
                </Link>):(
                  <Link to="/dashboard?tab=quizzes">
                  <Sidebar.Item icon={HiClipboardList} as="div">
                    Manager Quizz
                  </Sidebar.Item>
                </Link>
                )}
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
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
      </div>
  )
}
