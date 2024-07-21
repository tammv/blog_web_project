import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashQuizzes() {
  const { currentUser } = useSelector((state) => state.user);
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [quizIdToDelete, setQuizIdToDelete] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch(`/api/quiz/?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserQuizzes(data.quizzes);
          if(data.quizzes.length < 9){
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchQuizzes();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = userQuizzes.length;
    try {
      const res = await fetch(`/api/quiz/?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserQuizzes((prev) => [...prev, ...data.quizzes]);
        if (data.quizzes.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteQuiz = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/quiz/${quizIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserQuizzes((prev) => prev.filter((quiz) => quiz._id !== quizIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const filteredQuizzes = userQuizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.topicID.nameOfTopic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <input
        type="text"
        placeholder="Search quizzes tittle or topic"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      {currentUser.isAdmin && filteredQuizzes.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Quizz</Table.HeadCell>
              <Table.HeadCell>Topic</Table.HeadCell>
              <Table.HeadCell>Creator</Table.HeadCell> {/* Thêm cột Creator */}
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {filteredQuizzes.map((quiz) => (
                <Table.Row
                  key={quiz._id} // Add a unique key to each Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>{new Date(quiz.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link className="font-medium text-gray-900 dark:text-white" to={`/quiz/${quiz._id}`}>
                      {quiz.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    {quiz.topicID.nameOfTopic}
                  </Table.Cell>
                  <Table.Cell>{quiz.userId.username}</Table.Cell> {/* Hiển thị tên người tạo */}
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setQuizIdToDelete(quiz._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
              Show more
            </button>
          )}
        </>
      ) : (
        <p>No quizzes found!</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this quizz?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteQuiz}>
                Yes, I am sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
