import { FaRegCheckSquare, FaRegTrashAlt, FaTrashAlt, FaRegEdit, FaEdit, FaListUl } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Spinner, Button, Modal } from "flowbite-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import QuestionComp from "../components/QuestionComp";

export default function QuizDetailPremium() {
  const [quizzesStores, setQuizzesStores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditQuestion, setShowEditQuestion] = useState(false);
  const [questionEdit, setQuestionEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const { quizId } = useParams();
  const navigate= useNavigate();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await fetch(`/api/quiz/${quizId}`);
        const data = await res.json();
        setQuizzesStores(data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
      setLoading(false);
    };
      fetchTest();
  }, [quizId]);

  const handleReloadData = async () => {
    try {
      const res = await fetch(`/api/quiz/${quizId}`);
      const data = await res.json();
      setQuizzesStores(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  }
  
  const handleDeleteQuestion = async (e) =>{
    setLoading(true);
    const res = await fetch(`/api/quiz/${quizId}/question/${e}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      console.log(data.message);
    } else { 
      quizzesStores.questions = quizzesStores.questions.filter((question) => question._id !== e);
      setQuizzesStores(quizzesStores);
    }
    setLoading(false);
  }

  const handleDeleteQuizz = async () =>{
    const res = await fetch(`/api/quiz/${quizId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      console.log(data.message);
    } else {
      navigate('/quiz');
    }
  }

  const handleEditQuestion = async (e) =>{
    const questione = quizzesStores.questions.find((question) => question._id === e);
    setQuestionEdit(questione);
    setShowEditQuestion(true);
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
  );

  return (
    <div className="block w-auto mx-72">
      <div className="mt-10 mb-6">
        <div className="rounded z-10 p-16 h-56 bg-slate-50 border">
          <div className="p-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-light-3">Quiz: {quizzesStores.title}</h2>
              <span className="text-sm text-light-2">Topic: {quizzesStores.topicID.nameOfTopic}</span>
          </div>
          <div className="p-4 text-light-2">
            <h5>Description: {quizzesStores.description}</h5>
          </div>
          <div className="flex justify-between px-4 text-light-2">
            <p className="flex flex-row gap-2">
              <img className="w-6 h-6 rounded-full" src={quizzesStores.userId.profilePicture} alt="Avatar User Create Quizz" /> 
              {quizzesStores.userId.username}
            </p>
            <Link className="flex flex-row justify-center items-center gap-3" to={`/game/quiz/${quizId}`}>
              <Button type="button" className="rounded-md p-0 md:px-4 text-white border-gray-600 shadow-sm bg-gradient-to-r from-orange-600 to-blue-600 hover:bg-gradient-to-r hover:from-violet-800 hover:to-blue-500"> Play </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-row w-full justify-between mb-10 gap-3">
        <Link className="flex flex-row justify-center items-center w-full" to={`/quiz/${quizId}/questions`}> 
        <Button className="w-full bg-gradient-to-r from-violet-900 to-blue-600 hover:bg-gradient-to-r hover:from-violet-800 hover:to-blue-500">
          <div className="flex flex-row justify-center items-center gap-3"><FaEdit/> Add Question</div>
        </Button>
        </Link>
        <Button className="w-full bg-gradient-to-r from-rose-900 to-red-600 hover:bg-gradient-to-r hover:from-rose-600 hover:to-red-300" onClick={() => setShowModal(true)} ><div className="flex flex-row justify-center items-center gap-3"><FaTrashAlt/> Delete Quizz </div></Button>
      </div>
      <div className="flex flex-col">
        <div className="px-2 flex flex-row items-center gap-2">
          <FaListUl/>
          <h3>{quizzesStores.questions.length} question</h3>
        </div>
        {quizzesStores.questions && quizzesStores.questions.map((item, index) => (
        <div className="p-4 rounded-lg bg-slate-50 my-4 drop-shadow-md hover:drop-shadow-xl" key={index}>
          <div className="drop-shadow-2xl">
            <div className="flex justify-between h-5 mb-6">
              <div className="flex gap-10 items-center">
                <div className="flex gap-2 items-center">
                  <FaRegCheckSquare/>
                  <span>{index+1}. Nhiều lựa chọn</span>
                </div>
                <div className="flex">
                  <span className={` rounded-md px-2 text-white bg-${item.level === "easy"?"green-500": item.level === "medium" ? "yellow-300": "red-600" }`}>
                    {item.level.charAt(0).toUpperCase() + item.level.slice(1)}
                  </span>
                </div>
              </div>
              <div className="flex gap-6">
                <FaRegEdit onClick={() => handleEditQuestion(item._id)}/>
                <FaRegTrashAlt onClick={() => handleDeleteQuestion(item._id)}/>
              </div>
            </div>
            <div className="flex gap-2 items-center mb-4">
              <div className="text-sm flex justify-center overflow-hidden w-full text-zinc-900 items-center self-center">
                <p>{item.text}</p>
              </div>
            </div>
          </div>
          <div className="h-6 mb-4">
            <span className="absolute px-2 text-black left-4">
              Lựa chọn trả lời
            </span>
          </div>
          <div className="grid grid-cols-2">
          {item.options.map((option, optionIndex) => (
              <div className="flex items-start mb-2 w-full" key={optionIndex}>
                <span className={`w-4 h-4 rounded-full my-1 mr-2 shrink-0 relative bg-${
                     item.correctAnswerIndex.includes(optionIndex) ? "green-500" : "red-600"
                  }`}></span>
                <span className="text-sm text-dark-2">{option}</span>
              </div>
          ))}
          </div>
        </div>
        ))}
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this quizz?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDeleteQuizz()}>
                Yes, I am sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showEditQuestion} onClose={() => { handleReloadData(); setShowEditQuestion(false)}} popup size="max">
        <Modal.Header />
        <Modal.Body>
          <div className="flex justify-center">
            <div className="text-center w-full md:w-2/3">
              {questionEdit !== null && (
                  <QuestionComp question={questionEdit}/>
                )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}