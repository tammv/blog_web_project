import { Button, Checkbox, Textarea } from "flowbite-react";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoAddSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function QuestionComp() {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([{text: "", checked: false}, {text: "", checked: false}]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState([]);
  const { quizId } = useParams();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        console.log(quizId);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };
      fetchTest();
  });

  const color = ['bg-red-400', 'bg-orange-500', 'bg-lime-600', 'bg-green-700', 'bg-blue-700', 'bg-violet-600', 'bg-fuchsia-400', 'bg-pink-600'];

  const handleAddOption = () => {
    if(options.length <= 6)
      setOptions([...options, { text: "", checked: false }]);
  };

  const handleRemoveOption = (index) => {
    if(options.length >= 3){
      const updatedOptions = [...options.slice(0, index), ...options.slice(index + 1)];
      setOptions(updatedOptions);
    }
  };

  const handleOptionChange = (index, event) => {
    const updatedOptions = [...options];
    updatedOptions[index].text = event.target.value;
    setOptions(updatedOptions);
  };

  const handleOptionChecked = (index) => {
    const updatedCorrectAnswerIndices = [...correctAnswerIndex];
    const optionIndexInArray = updatedCorrectAnswerIndices.indexOf(index);

    if (optionIndexInArray !== -1) {
      updatedCorrectAnswerIndices.splice(optionIndexInArray, 1);
    } else {
      updatedCorrectAnswerIndices.push(index);
    }

    setCorrectAnswerIndex(updatedCorrectAnswerIndices);
    setOptions(
      options.map((option, i) => (i === index ? { ...option, checked: true } : option))
    );
  };

  const handleSubmitQuestion = async () => {
    if (!questionText || options.length < 2 || correctAnswerIndex.length === 0) {
      alert("Please fill out all fields and select at least one correct answer!");
      return;
    }

    const questionData = {
      text: questionText,
      options: options.map((option) => option.text),
      correctAnswerIndex: correctAnswerIndex,
    };

    try {
      const res = await fetch(`/api/quiz/${quizId}/question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("Error: " + data);
        return;
      }
      console.log(data);
    
    } catch (error) {
      console.log(error);
    }

    setQuestionText("");
    setOptions([{ text: "", checked: false },{ text: "", checked: false }]);
    setCorrectAnswerIndex([]);
  };

  return (
    <>
      <div className="bg-fuchsia-900 py-2 rounded-lg min-h-96">
        <div className="mx-2">
          <Textarea
            type="text"
            placeholder="Enter your question here"
            required
            className="resize-none text-center flex-1 min-h-60 bg-fuchsia-950 p-9 text-white placeholder-slate-50"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row w-full h-full gap-2">
          <div className="grid py-4 mx-2 md:grid-flow-col md:auto-cols-fr w-full h-full gap-2">
            {options.map((option, index) => (
              <div className={`flex flex-col items-center rounded-lg min-h-56 h-full gap-y-2 ${ color[index+1]}`} key={index}>
                <div className="flex items-center justify-between w-full mt-2">
                    <FaRegTrashAlt className="text-white mx-2" onClick={() => handleRemoveOption(index)}/>
                    <Checkbox
                      type="checkbox"
                      className="mx-2"
                      checked={correctAnswerIndex.includes(index)}
                      onChange={() => handleOptionChecked(index)}
                    />
                </div>
                <div className="flex flex-col justify-center relative p-2 text-white text-center rounded text-lg overflow-y-auto h-full w-full max-h-full">
                  <Textarea
                    key={index}
                    type="text"
                    placeholder={`Enter reply options here ${index + 1}`}
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e)}
                    className="resize-none border-none blur-none bg-inherit h-full w-full text-center text-xs text-white placeholder-slate-50"
                  />
                </div>
              </div>
            ))}
          </div>
          <Button className="flex items-center bg-inherit w-5 mr-2" onClick={handleAddOption}>
            <IoAddSharp className="bg-gray-500 border-spacing-2 rounded-sm w-4 h-4"/>
          </Button>
        </div>
      </div>
      <div className="flex justify-center mt-9 gap-9">
        <Button className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% hover:from-pink-500 hover:to-yellow-500" onClick={handleSubmitQuestion}>
          Add Question
        </Button>
        <Link to={`/quiz/${quizId}`}>
          <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500">
            Back To Quizz
          </Button>
        </Link>
      </div>
    </>
  );
}

export default QuestionComp;
