export default function Question({ question }) {
  if (!question) {
    return <div>Question data is missing.</div>;
  }

  const { text, options } = question;

  return (
    <div className="bg-fuchsia-700 h-96 min-w-80">
      <h2 className="text-gray-800">{text}</h2>
      <ul>
        {options.map((option, index) => (
          <li className="flex gap-2 p-2 items-center" key={index}>
            <input
              type="checkbox"
              id={`option-${index}`}
              name={`option-${index}`}
              value={option}
            />
            <label htmlFor={`option-${index}`}>{option}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}

