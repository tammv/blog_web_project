import { Button, Select, TextInput, Textarea } from "flowbite-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import "react-circular-progressbar/dist/styles.css";

function QuizComp() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch("/api/topic");
        const data = await res.json();
        if (res.ok) {
          setTopics(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const quizData = {
      topicID: selectedTopic,
      title: formData.title,
      description: formData.description || "",
      questions: [],
    };

    try {
      const res = await fetch("/api/quiz/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        return;
      }
      if(res.ok){
        navigate(`/quiz/${data._id}/questions`)
        console.log(data._id);
        setSelectedTopic("");
        setFormData({});
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`p-3 max-w-3xl mx-auto dark-container`}>
      <h1 className="text-center text-3xl my-7 font-semibold ">Create Quiz</h1>
      <form className="flex flex-col gap-4 ">
          <div className="my-10 mx-9">
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
              <TextInput
                type="text"
                placeholder="Title"
                required
                id="title"
                className="flex-1"
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Select
                onChange={(e) => {
                  setFormData({ ...formData, topicID: e.target.value });
                  setSelectedTopic(e.target.value);
                }}
                value={selectedTopic}
                required
              >
                <option value="" disabled>
                  Select a Topic
                </option>
                {topics.map((topic) => (
                  <option key={topic._id} value={topic._id}>
                    {topic.nameOfTopic}
                  </option>
                ))}
              </Select>
            </div>
            <div className="my-6">
              <Textarea
                className="resize-none h-32"
                id="description"
                type="text"
                placeholder="Description"
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid">
              <Button className="w-full" type="submit" gradientDuoTone="purpleToPink" onClick={handleSubmit}>Create Quiz</Button>
            </div>
          </div>
      </form>
    </div>
  );
}

export default QuizComp;