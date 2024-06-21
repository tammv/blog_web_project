import { Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";

export default function TopicList() {
  const [topics, setTopics] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch(`/api/topic/`);
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          // Thêm trạng thái follow vào mỗi topic
          const topicsWithFollowStatus = data.map(topic => ({
            ...topic,
            isFollowed: topic.followers.includes(currentUser._id)
          }));
          setTopics(topicsWithFollowStatus);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchTopics();
  }, [currentUser._id]);

  const handleAddUserToTopic = async (topicId) => {
    try {
      const res = await fetch(`/api/topic/${topicId}/addUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: currentUser._id })
      });
      const data = await res.json();
      console.log(data);

      // Cập nhật trạng thái follow cho topic
      setTopics(prevTopics => prevTopics.map(topic =>
        topic._id === topicId ? { ...topic, isFollowed: true } : topic
      ));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex overflow-x-auto gap-2">
      {topics.map((topic, index) => (
        <div key={index} className="flex items-center gap-1">
          <Button
            className={`flex items-center justify-between px-2 py-1 rounded-lg shadow-md transition duration-150 ${topic.isFollowed ? 'bg-green-500 hover:bg-green-600 active:bg-green-700' 
              : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white'}`}
          >
            {topic.nameOfTopic}
            <span
              className="ml-2 bg-white text-blue-500 rounded-full w-4 h-4 flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 transition-all duration-150"
              onClick={(e) => {
                e.stopPropagation();
                handleAddUserToTopic(topic._id);
              }}
            >
              +
            </span>
          </Button>
        </div>
      ))}
    </div>
  )
}