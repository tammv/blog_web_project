import { Button, Checkbox, Textarea,Select, Spinner } from "flowbite-react";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoAddSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function QuestionComp(question) {
  const [loading, setLoading] = useState(true);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([{text: "", checked: false}, {text: "", checked: false},{text: "", checked: false}, {text: "", checked: false}]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState([]);
  const [selectedLevel, setSelectLevel] = useState("");
  const { quizId } = useParams();

  useEffect(() => {
    const fetchTest = async () => {
      setLoading(true);
      try {
        if(question.question != null){
          setQuestionText(question.question.text);
          const optionData = question.question.options;
          const checkData = question.question.correctAnswerIndex;
          const formattedOptions = optionData.map((option, i) => ({
            text: option,
            checked: checkData.includes(i),
          }));
          setOptions(formattedOptions);
          setCorrectAnswerIndex(checkData);
          setSelectLevel(question.question.level)
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
      setLoading(false);
    };
      fetchTest();
  },[question]);

  const color = ['bg-red-400', 'bg-orange-500', 'bg-lime-600', 'bg-green-700', 'bg-blue-700', 'bg-violet-600', 'bg-fuchsia-400', 'bg-pink-600'];

  const handleAddOption = () => {
    if(options.length <= 6)
      setOptions([...options, { text: "", checked: false }]);
  };

  const handleRemoveOption = (index) => {
    if(options.length >= 3){
      const updatedOptions = [...options.slice(0, index), ...options.slice(index + 1)];
      const updatedCorrectAnswerIndices = [];
      updatedOptions.map((option, index) => {
        if (option.checked)
          updatedCorrectAnswerIndices.push(index);
      })
      setCorrectAnswerIndex(updatedCorrectAnswerIndices);
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

    if(options.some((option) => option.checked && !option.text.trim())){
      alert("Please enter text when mark it correct!");
      return;
    }

    const checkOptions = options.some((option) => option.text.trim());

    const updatedOptions = [];
    const updatedCorrectAnswerIndices = [];

    let questionData;

    if(checkOptions){
      options.map((option) => {
        if(option.text.trim())
          updatedOptions.push({text: option.text, checked: option.checked})
      })

      updatedOptions.map((option, index) => {
        if(option.checked)
          updatedCorrectAnswerIndices.push(index)
      })

      questionData = {
        text: questionText,
        options: updatedOptions.map((option) => option.text),
        correctAnswerIndex: updatedCorrectAnswerIndices,
        level: selectedLevel || "easy"
      };
    }else{
      questionData = {
        text: questionText,
        options: options.map((option) => option.text),
        correctAnswerIndex: correctAnswerIndex,
        level: selectedLevel || "easy"
      };
    }

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

  const handleUpdateQuestion = async () => {
    if (!questionText || options.length < 2 || correctAnswerIndex.length === 0) {
      alert("Please fill out all fields and select at least one correct answer!");
      return;
    }

    const questionData = {
      text: questionText,
      options: options.filter((option) => option.text !== '' && option.text !== null).map((option) => option.text),
      correctAnswerIndex: correctAnswerIndex,
      level: selectedLevel
    };

    try {
      setLoading(true);
      const res = await fetch(`/api/quiz/${quizId}/question/${question.question._id}`, {
        method: "PUT",
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
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
  );

  return (
    <>
      <div className="bg-fuchsia-900 py-2 rounded-lg min-h-96">
        <div className="mx-2">
          <Textarea
            type="text"
            placeholder="Enter your question here"
            required
            className="flex resize-none bg-fuchsia-950 items-center text-center text-white text-xl placeholder-slate-50 min-h-60 p-9 focus:outline-none"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
        </div>
        <div className="flex justify-center my-2">
          <Select onChange={(e) => { setSelectLevel(e.target.value); }}
                  value={selectedLevel}
                  required
                >
                  <option value="" disabled>
                    Select a Level Question
                  </option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="difficult">Difficult</option>
          </Select>
        </div>
        <div className="flex flex-col md:flex-row w-full h-full gap-2">
          <div className="grid py-4 mx-2 md:grid-flow-col md:auto-cols-fr md:w-auto lg:w-full h-full gap-2">
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
                <div className="flex flex-col sm:flex-row justify-center relative p-2 text-white text-center rounded text-xl overflow-y-auto h-full w-full max-h-full">
                  <Textarea
                    key={index}
                    type="text"
                    placeholder={`Enter reply options here ${index + 1}`}
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e)}
                    className="resize-none border-none place-content-center pb-4 focus:outline-none bg-inherit h-full w-full text-center text-lg text-white placeholder-slate-50"
                  />
                </div>
              </div>
            ))}
          </div>
          <button className="flex flex-col justify-between self-center hover:bg-none items-center bg-inherit w-5 h-5 mr-2" onClick={handleAddOption}>
            <IoAddSharp className="bg-gray-500 border-spacing-2 rounded-sm w-4 h-4"/>
          </button>
        </div>
      </div>
      {question.question == null ? (
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
      ):(
        <div className="flex justify-center mt-9 gap-9">
        <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500" onClick={handleUpdateQuestion}>
          Update Question
        </Button>
        </div>
      )}
    </>
  );
}

export default QuestionComp;