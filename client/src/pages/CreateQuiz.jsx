import "react-quill/dist/quill.snow.css";
import "react-circular-progressbar/dist/styles.css";
import QuizComp from "../components/QuizComp";
import QuestionComp from "../components/QuestionComp";
import { useParams } from "react-router-dom";

function CreateQuiz() {
  const { quizId } = useParams();
  if (quizId)
    return (
      <div className="h-auto w-auto mx-40 py-6 bg-orange-200">
        <QuestionComp question={null}/>
      </div>
      );

  return (
    <div className={`p-3 max-w-3xl mx-auto dark-container`}>
        <QuizComp/>
    </div>
  );
}

export default CreateQuiz;