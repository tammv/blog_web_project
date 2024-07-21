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
    const [searchQuery, setSearchQuery] = useState(""); // Add search query state

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/quiz`);
                const data = await res.json();
                if (res.ok) {
                    setQuizzesData(data.quizzes);
                } else {
                    console.error(data.message);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching quizzes:", error);
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="xl" />
            </div>
        );
    }

    // Filter quizzes based on the search query
    const filteredQuizzes = quizzesData.filter((quiz) =>
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="flex flex-col max-w-6xl mx-auto p-5">
            <div className="flex flex-auto justify-center gap-10 backdrop-blur-lg mb-4">
                {currentUser && (currentUser.isPremium || currentUser.isAdmin) && (
                    <Button>
                        <Link className="flex items-center gap-2" to="/create-quiz">
                            <HiClipboardList /> Create Quiz
                        </Link>
                    </Button>
                )}
                {currentUser && currentUser.isAdmin ? (
                    <Button>
                        <Link className="flex items-center gap-2" to="/dashboardadmin?tab=quizzesadmin">
                            <HiClipboardList /> Manage Quizzes
                        </Link>
                    </Button>
                ) : (
                    <Button>
                        <Link className="flex items-center gap-2" to="/dashboard?tab=quizzes">
                            <HiClipboardList /> Your Quizzes
                        </Link>
                    </Button>
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
