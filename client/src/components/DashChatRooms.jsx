import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { db } from '../firebase';
import { ref as dbRef, get, remove, onValue } from 'firebase/database';

export default function DashChatRooms() {
  const { currentUser } = useSelector((state) => state.user);
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [roomIdToDelete, setRoomIdToDelete] = useState("");

  useEffect(() => {
    const fetchRooms = () => {
      const roomsRef = dbRef(db, 'rooms');
      onValue(roomsRef, (snapshot) => {
        const roomsData = [];
        snapshot.forEach((childSnapshot) => {
          roomsData.push({ id: childSnapshot.key, data: childSnapshot.val() });
        });
        setRooms(roomsData);
      });
    };

    fetchRooms();
  }, []);

  const handleDeleteRoom = async () => {
    setShowModal(false);
    try {
      const roomRef = dbRef(db, `rooms/${roomIdToDelete}`);
      await remove(roomRef);
      setRooms((prev) => prev.filter((room) => room.id !== roomIdToDelete));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {rooms.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Rooms image</Table.HeadCell>
              <Table.HeadCell>Rooms name</Table.HeadCell>
              <Table.HeadCell>Members</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {rooms.map((room) => (
                <Table.Row key={room.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{new Date(room.data.updatedAt || Date.now()).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <img src={room.data.image || 'https://via.placeholder.com/150'} alt={room.data.name} className="w-20 h-10 object-cover bg-gray-500" />
                  </Table.Cell>
                  <Table.Cell>{room.data.name}</Table.Cell>
                  <Table.Cell>{room.data.members ? room.data.members.length : 0}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setRoomIdToDelete(room.id);
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
        <p>You have no rooms yet!</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this room?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteRoom}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
