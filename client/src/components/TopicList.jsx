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

        if (currentUser && currentUser._id) {
          const topicsWithFollowStatus = data.map((topic) => ({
            ...topic,
            isFollowed: topic.followers.includes(currentUser._id),
          }));
          setTopics(topicsWithFollowStatus);
        }
      } catch (error) {
        console.error("Error fetching topics:", error.message);
      }
    };

    fetchTopics();
  }, [currentUser]);

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

      if (currentUser && currentUser._id) {
        setTopics((prevTopics) =>
          prevTopics.map((topic) => (topic._id === topicId ? { ...topic, isFollowed: true } : topic))
        );
      }
    } catch (error) {
      console.error("Error following topic:", error.message);
    }
  };

  const handleRemoveUserFromTopic = async (topicId) => {
    try {
      const res = await fetch(`/api/topic/${topicId}/removeUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUser._id }),
      });

      if (!res.ok) {
        throw new Error("Failed to unfollow topic");
      }

      if (currentUser && currentUser._id) {
        setTopics((prevTopics) =>
          prevTopics.map((topic) => (topic._id === topicId ? { ...topic, isFollowed: false } : topic))
        );
      }
    } catch (error) {
      console.error("Error unfollowing topic:", error.message);
    }
  };


  return (
    <div className="flex overflow-x-auto gap-2 whitespace-nowrap">
      {topics.map((topic) => (
        <div key={topic._id} className="flex items-center gap-1">
          <Button
            className={`flex items-center px-2 py-1 rounded-lg shadow-md transition duration-150 ${topic.isFollowed
              ? "bg-green-500 hover:bg-green-600 active:bg-green-700"
              : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white"
              }`}
            onClick={(e) => {
              e.stopPropagation();
              if (topic.isFollowed) {
                handleRemoveUserFromTopic(topic._id);
              } else {
                handleAddUserToTopic(topic._id);
              }
            }}
          >
            {topic.nameOfTopic}
            <span
              className="ml-2 bg-white text-blue-500 rounded-full w-4 h-4 flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 transition-all duration-150 cursor-pointer"
            >
              {topic.isFollowed ? '-' : '+'}
            </span>
          </Button>
        </div>
      ))}
    </div>
  );
}
