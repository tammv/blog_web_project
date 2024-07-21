import { useSelector } from "react-redux";
import QuizDetailPremium from "../components/QuizDetailPremium";
import QuizDetailUser from "../components/QuizDetailUser";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "flowbite-react";

export default function QuizDetail() {
  const { currentUser } = useSelector((state) => state.user);
  const [ checkPermissions, setCheckPermissions ] = useState(false);
  const [loading, setLoading] = useState(true);
  const { quizId } = useParams();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await fetch(`/api/quiz/${quizId}`);
        const data = await res.json();
        console.log(currentUser);
        if(data.userId._id === currentUser._id){
          setCheckPermissions(true);
        }
      } catch (error) {
        console.error("Error fetching quizz: ", error);
      }
      setLoading(false);
    };
      fetchTest();
  }, [quizId, currentUser]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
  );

  return currentUser  ? (
    (currentUser.isPremium  && checkPermissions) ? (
      <QuizDetailPremium/>
    ) : (
      <QuizDetailUser/>
    )
  ) : (
    <div className="text-center">You need to be logged in to access quiz details.</div>
  );
}