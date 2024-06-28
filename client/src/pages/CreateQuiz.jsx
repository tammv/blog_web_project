import { Button, Select, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import "react-circular-progressbar/dist/styles.css";

export default function QuizPage() {
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState("");
    const [formData, setFormData] = useState({});

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
    

  return (
    <div className={`p-3 max-w-3xl mx-auto min-h-screen dark-container`}>
      <h1 className="text-center text-3xl my-7 font-semibold  ">Create quiz</h1>
      <form className="flex flex-col gap-4 ">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Select onChange={(e) => {
              setFormData({ ...formData, topicID: e.target.value });
              setSelectedTopic(e.target.value); // Update the selected topic
            }}
            value={selectedTopic}
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
        <div className="flex gap-4 items-center justify-between p-3">
          <TextInput type="text" placeholder="Question" required className="flex-1">

          </TextInput>
          
        </div>
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
        
      </form>
    </div>
  )
}
