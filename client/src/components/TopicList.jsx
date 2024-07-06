import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function TopicList() {
  const [topics, setTopics] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch(`/api/topic/`);
        if (!res.ok) {
          throw new Error("Failed to fetch topics");
        }
        const data = await res.json();

        // Add follow status to each topic if currentUser and currentUser._id exist
        if (currentUser && currentUser._id) {
          const topicsWithFollowStatus = data.map((topic) => ({
            ...topic,
            isFollowed: topic.followers.includes(currentUser._id),
          }));
          setTopics(topicsWithFollowStatus);
        }
      } catch (error) {
        console.error("Error fetching topics:", error.message);
        // Handle error (e.g., show error message to user)
      }
    };

    fetchTopics();
  }, [currentUser]); // Include currentUser in dependency array

  const handleAddUserToTopic = async (topicId) => {
    try {
      const res = await fetch(`/api/topic/${topicId}/addUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUser._id }),
      });

      if (!res.ok) {
        throw new Error("Failed to follow topic");
      }

      // Update follow status for the topic if currentUser and currentUser._id exist
      if (currentUser && currentUser._id) {
        setTopics((prevTopics) =>
          prevTopics.map((topic) => (topic._id === topicId ? { ...topic, isFollowed: true } : topic))
        );
      }
    } catch (error) {
      console.error("Error following topic:", error.message);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="flex overflow-x-auto gap-2">
      {topics.map((topic) => (
        <div key={topic._id} className="flex items-center gap-1">
          <Button
            className={`flex items-center justify-between px-2 py-1 rounded-lg shadow-md transition duration-150 ${
              topic.isFollowed
                ? "bg-green-500 hover:bg-green-600 active:bg-green-700"
                : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white"
            }`}
          >
            {topic.nameOfTopic}
            <span
              className="ml-2 bg-white text-blue-500 rounded-full w-4 h-4 flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 transition-all duration-150 cursor-pointer"
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
  );
}
