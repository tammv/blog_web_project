import { FaRegCheckSquare, FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import { Spinner } from "flowbite-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function DisplayQuestion() {
  const [quizzesStores, setQuizzesStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const { quizId } = useParams();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await fetch(`/api/quiz/${quizId}`);
        const data = await res.json();
        console.log(data);
        setQuizzesStores(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };
      fetchTest();
  }, []);

  const handleDeleteQuestion = async (e) =>{
    console.log(e);
    // const res = await fetch(`/api/quiz/${quizId}/questions/${e}`, {
    //   method: "DELETE",
    // });
    // const data = await res.json();
    // if (!res.ok) {
    //   console.log(data.message);
    // } else {
    //   console.log(data);
    // }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
  );

  return (
    <div className="block w-auto mx-72">
      <div className="mt-10 mb-20">
        <div className="relative rounded z-10 p-16 h-56 bg-slate-50 border">
        <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-light-3">Quiz: {quizzesStores.title}</h2>
        <span className="text-sm text-light-2">Topic: {quizzesStores.topicID.nameOfTopic}</span>
        </div>
        <div className="p-4 text-light-2">
          <span>Description: <p>{quizzesStores.description}</p></span>
        </div>
        </div>
      </div>
      <div className="">
        {quizzesStores.questions && quizzesStores.questions.map((item, index) => (
        <div className="p-4 rounded-lg bg-slate-50 my-4 drop-shadow-md hover:drop-shadow-xl" key={index}>
          <div className="drop-shadow-2xl">
            <div className="flex justify-between h-5 mb-6">
              <div className="flex gap-2 items-center">
                <FaRegCheckSquare/>
                <span>{index+1}. Nhiều lựa chọn</span>
              </div>
              <div className="flex gap-6">
                <FaRegEdit/>
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
                    optionIndex == item.correctAnswerIndex ? "green-500" : "red-600"
                  }`}></span>
                <span className="text-sm text-dark-2">{option}</span>
              </div>
          ))}
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}
