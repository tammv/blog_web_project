import { useState } from "react";

export default function Question({ question, handleSelect, selectedOptions }) {
  if (!question) {
    return <div>Question data is missing.</div>;
  }

  const [selectedValues, setSelectedValues] = useState(
    selectedOptions ? [...selectedOptions] : []
  );

  const handleOptionChange = (event) => {
    const { checked, value } = event.target;
    const isSingleChoice = question.correctAnswerIndex.length === 1;

    if (isSingleChoice) {
      setSelectedValues([checked ? value : null]); // Single choice: only store one value
      handleSelect(selectedValues); // Immediately update state in QuizGame
    } else {
      const updatedValues = [...selectedValues];
      const index = updatedValues.indexOf(value);
      if (checked) {
        if (!updatedValues.includes(value)) {
          updatedValues.push(value); // Add selected option for multiple choice
        }
      } else {
        updatedValues.splice(index, 1); // Deselect option for multiple choice
      }
      setSelectedValues(updatedValues);
      handleSelect(selectedValues);
    }
  };

  const { text, options } = question;

  return (
    <div className="bg-blue-700 h-96 min-w-80 p-10 rounded-3xl mb-6">
      <h2 className="text-white text-lg h-auto p-10">{text}</h2>
      <ul className="flex flex-row p-1 mb-2">
        {options.map((option, index) => (
          <li className="flex gap-2 p-2 items-center" key={index}>
            <input
              type={question.correctAnswerIndex.length === 1 ? "radio" : "checkbox"}
              id={`option-${index}`}
              name={`option-${index}`}
              value={option}
              checked={selectedValues.includes(option)} // Check if option is selected
              onChange={handleOptionChange}
            />
            <label htmlFor={`option-${index}`}>{option}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}
