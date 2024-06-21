import { Modal, Table, Button, TextInput, Label } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashTopics() {
  const { currentUser } = useSelector((state) => state.user);
  const [topics, setTopics] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [topicIdToDelete, setTopicIdToDelete] = useState("");
  const [newTopicName, setNewTopicName] = useState("");
  const [reloadTopics, setReloadTopics] = useState(true); // State để kiểm soát khi nào cần reload topics

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch("/api/topic");
        const data = await res.json();
        if (res.ok) {
          setTopics(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin && reloadTopics) {
      fetchTopics();
      setReloadTopics(false); // Đánh dấu đã reload, để useEffect không chạy lại ngay lập tức
    }
  }, [currentUser.isAdmin, reloadTopics]); // Chỉ gọi lại khi currentUser.isAdmin hoặc reloadTopics thay đổi

  const handleCreateTopic = async () => {
    try {
      const res = await fetch("/api/topic/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameOfTopic: newTopicName,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowCreateModal(false);
        setNewTopicName("");
        setReloadTopics(true); // Khi tạo thành công, set lại state để reload topics
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteTopic = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/topic/${topicIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setTopics((prev) => prev.filter((topic) => topic._id !== topicIdToDelete));
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && topics.length > 0 ? (
        <>
          <Button onClick={() => setShowCreateModal(true)} className="mb-4">
            Create New Topic
          </Button>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Topic Name</Table.HeadCell>
              <Table.HeadCell>Creator</Table.HeadCell>
              <Table.HeadCell>Followers</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {topics.map((topic) => (
                <Table.Row key={topic._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{topic.nameOfTopic}</Table.Cell>
                  <Table.Cell>
                    {topic.userId ? (
                      <Link to={`/user/${topic.userId._id}`}>{topic.userId.username}</Link>
                    ) : (
                      "N/A"
                    )}
                  </Table.Cell>
                  <Table.Cell>{topic.followers.length}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setTopicIdToDelete(topic._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      ) : (
        <p>You have no topics yet!</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this topic?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteTopic}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <div>
              <Label htmlFor="topicName" value="Topic Name" />
              <TextInput id="topicName" value={newTopicName} onChange={(e) => setNewTopicName(e.target.value)} required />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCreateTopic}>Create Topic</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
