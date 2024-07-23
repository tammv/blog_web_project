import { Modal, Table, Button, TextInput, Label } from "flowbite-react";
import { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { AuthContext } from '../redux/auth-context';
import { db, storage } from '../firebase';
import { ref as dbRef, set, push, query, orderByChild, equalTo, get, remove } from 'firebase/database';
import { ref as storageRef, getDownloadURL, uploadBytes } from 'firebase/storage';

export default function DashTopics() {
  const { currentUser } = useSelector((state) => state.user);
  const authContext = useContext(AuthContext);
  const [topics, setTopics] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [topicIdToDelete, setTopicIdToDelete] = useState("");
  const [newTopicName, setNewTopicName] = useState("");
  const [reloadTopics, setReloadTopics] = useState(true);

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
      setReloadTopics(false);
    }
  }, [currentUser.isAdmin, reloadTopics]);

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
        setReloadTopics(true);
        await addNewRoom(newTopicName, null);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const addNewRoom = async (newRoomName, file) => {
    let imageUrl = "";
    if (file) {
        try {
            const fileRef = storageRef(storage, `room_images/${file.name}`);
            const snapshot = await uploadBytes(fileRef, file);
            imageUrl = await getDownloadURL(snapshot.ref);
        } catch (error) {
            console.error("Failed to upload image: " + error.message);
            return;
        }
    }

    try {
        const user = JSON.parse(localStorage.getItem('user')) || authContext.user;
        const newRoomRef = push(dbRef(db, 'rooms'));
        await set(newRoomRef, {
            name: newRoomName,
            image: imageUrl || 'https://i.pinimg.com/564x/41/66/cd/4166cd94bd5b55d158a39e81b20a950a.jpg',
            members: [user.uid],
        });
    } catch (error) {
        console.error("Error adding room: " + error.message);
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
        const deletedTopic = topics.find((topic) => topic._id === topicIdToDelete);
        setTopics((prev) => prev.filter((topic) => topic._id !== topicIdToDelete));

        if (deletedTopic) {
          const roomQuery = query(dbRef(db, 'rooms'), orderByChild('name'), equalTo(deletedTopic.nameOfTopic));
          const roomSnapshot = await get(roomQuery);
          roomSnapshot.forEach(async (roomChild) => {
            await remove(roomChild.ref);
          });
        }
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
                Yes, I&#x27;m sure
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
