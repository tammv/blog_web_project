import { useEffect, useState } from "react";
import { Spinner, Modal} from "flowbite-react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdRadioButtonUnchecked } from "react-icons/md";

export default function QuizResult(e) {
    const [results, setResults] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [index, setIndex] = useState();
    const [score, setScore] = useState(0);
   
    useEffect(() => {
        setResults(e.results);
        setIsLoading(false);
        setModal(false);
        if (!e.results || !Array.isArray(e.results)) {
            console.error("Lỗi: 'e.results' bị thiếu hoặc không phải là mảng.");
            setIsLoading(false);
        }
        setScore(handleSaveScore(e.results));
      }, [e]);

    const handleSaveScore = (answerDatas) => {
      let score = 0;
      answerDatas.forEach((index) => {
        const isCorect = handleCheckAnswer(index.answerData.correctAnswerIndex, index.answerData.answers, index.answerData.options);
        if(isCorect)
          score++;
      })
      return score;
    }

    const handleCheckAnswer = (correctAnswerIndex, answerCheck, optionCheck) => {
        const positions = [];
        if (Array.isArray(answerCheck)) {
            answerCheck.forEach(answer => {
              const index = optionCheck.indexOf(answer);
              if (index !== -1) {
                positions.push(index);
              }
            });
        } else {
            const index = optionCheck.indexOf(answerCheck);
            if (index !== -1) {
                positions.push(index);
            }
        }
        correctAnswerIndex.sort();
        positions.sort();
        if (correctAnswerIndex.length !== positions.length) {
            return false;
        }
        for (let i = 0; i < correctAnswerIndex.length; i++) {
            if (correctAnswerIndex[i] !== positions[i]) {
            return false;
            }
        }
        return true;
    }

    const handleCheckOptions = (options, answers) => {
      const positions = [];
        if (Array.isArray(answers)) {
          answers.forEach(answer => {
              const index = options.indexOf(answer);
              if (index !== -1) {
                positions.push(index);
              }
            });
        } else {
            const index = options.indexOf(answers);
            if (index !== -1) {
                positions.push(index);
            }
        }
        positions.sort();
        return positions;
    }

    const handleViewResult = async(e) => {
        const indexAnswer = handleCheckOptions(results[e].answerData.options, results[e].answerData.answers);
        setIndex({
          text: results[e].answerData.text,
          options: results[e].answerData.options,
          correctAnswerIndex: results[e].answerData.correctAnswerIndex,
          userAnswerIndex: indexAnswer
        })
        console.log(indexAnswer, results[e].answerData.correctAnswerIndex);
        setModal(true);
    }
   
  return (
    <div>
      {isLoading ? (
        <div>
          <Spinner />
        </div>
      ) : (
        <div className="max-w-3xl flex flex-auto flex-col">
        <div className="bg-cyan-900 rounded-md shadow-sm p-0 ml-2">
          <div className="flex justify-center items-center p-2 h-20">
              <span className="text-white mr-2">Number of correct answers is: {score}</span>
          </div>
        </div>
        <div className="flex flex-nowrap flex-col">
          {results.map((result, index) => (
            <button onClick={() => handleViewResult(index)} className={`border focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md shadow-sm m-4 ${handleCheckAnswer(result.answerData.correctAnswerIndex, result.answerData.answers, result.answerData.options)?"bg-green-600 border-green-500 focus:ring-green-500":"bg-red-600 border-red-500 focus:ring-red-500"}`} key={index}>
                <div className="bg-white rounded-md shadow-sm p-0 ml-2">
                    <div className="flex items-center p-2">
                        <span className="mr-2 text-gray-700"> {index + 1}. </span>
                        <p>{result.answerData.text}</p>
                    </div>
                    <div className="mt-2 flex flex-col space-y-2 pl-3 pb-2">
                    {result.answerData.options.map((option, i) => (
                        <div className="flex items-center" key={i}>
                            <p className="mr-2 text-gray-700">{option}</p>
                        </div>
                    ))}
                    </div>
                </div>
            </button>
          ))}
           <Modal show={modal} onClose={() => setModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                <div className="text-center">
                  {index && (
                    <div className="bg-white rounded-md shadow-sm p-0 ml-2">
                      <div className="flex justify-center items-center bg-gray-200 rounded-md p-2">
                          <span className="mr-2 text-gray-800"> {index.text} </span>
                      </div>
                      <div className="mt-2 flex flex-col items-start">
                        {index.options.map((option, i) => (
                          <div className="text-black w-full items-start px-4 py-2 m-1 flex flex-col justify-start focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" key={i}>
                              {index.userAnswerIndex.includes(i) ? <span className={`flex ml-1 px-2 py-1 bg-gray-200 rounded-t-lg items-start text-xs ${index.userAnswerIndex.includes(i) && index.correctAnswerIndex.includes(i) ? "text-green-600": "text-red-600"}`}> Your Answer </span> : null}
                              <div className="flex flex-row w-full px-4 py-2 bg-gray-200 rounded-md justify-start items-center">
                                <div className="m-1">
                                  {index.correctAnswerIndex.includes(i) ? <IoIosCheckmarkCircle className="text-green-500"/> : <MdRadioButtonUnchecked className="text-gray-500"/>}
                                </div>
                                <p className="mr-1 py-1 text-gray-700">{option}</p>
                              </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                </Modal.Body>
            </Modal>
        </div>
        </div>
      )}
    </div>
  )
}
