import { Modal, Table, Button, TextInput, Label } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle, HiX, HiPencilAlt } from "react-icons/hi";
import { db, storage } from '../firebase';
import { ref as dbRef, get, remove, onValue, update } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function DashChatRooms() {
  const { currentUser } = useSelector((state) => state.user);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [roomIdToDelete, setRoomIdToDelete] = useState("");
  const [roomToEdit, setRoomToEdit] = useState({});
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomImage, setNewRoomImage] = useState(null);

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

    const fetchUsers = () => {
      const usersRef = dbRef(db, 'users');
      onValue(usersRef, (snapshot) => {
        const usersData = {};
        snapshot.forEach((childSnapshot) => {
          usersData[childSnapshot.key] = childSnapshot.val();
        });
        setUsers(usersData);
      });
    };

    fetchRooms();
    fetchUsers();
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

  const handleRemoveMember = async (roomId, memberId) => {
    try {
      const roomRef = dbRef(db, `rooms/${roomId}`);
      const roomSnapshot = await get(roomRef);
      if (roomSnapshot.exists()) {
        const roomData = roomSnapshot.val();
        const updatedMembers = roomData.members.filter((id) => id !== memberId);
        await update(roomRef, { members: updatedMembers });
        setRooms((prev) =>
          prev.map((room) =>
            room.id === roomId
              ? { ...room, data: { ...room.data, members: updatedMembers } }
              : room
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEditRoom = (room) => {
    setRoomToEdit(room);
    setNewRoomName(room.data.name);
    setShowEditModal(true);
  };

  const handleUpdateRoom = async () => {
    try {
      const roomRef = dbRef(db, `rooms/${roomToEdit.id}`);
      const updates = { name: newRoomName };

      if (newRoomImage) {
        const fileRef = storageRef(storage, `room_images/${newRoomImage.name}`);
        const snapshot = await uploadBytes(fileRef, newRoomImage);
        const imageUrl = await getDownloadURL(snapshot.ref);
        updates.image = imageUrl;
      }

      await update(roomRef, updates);
      setRooms((prev) =>
        prev.map((room) =>
          room.id === roomToEdit.id
            ? { ...room, data: { ...room.data, ...updates } }
            : room
        )
      );

      setShowEditModal(false);
      setNewRoomName("");
      setNewRoomImage(null);
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
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {rooms.map((room) => (
                <Table.Row key={room.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{new Date(room.data.updatedAt || Date.now()).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <img src={room.data.image || 'https://via.placeholder.com/150'} alt={room.data.name} className="w-20 h-10 object-cover bg-gray-500" />
                  </Table.Cell>
                  <Table.Cell>{room.data.name}</Table.Cell>
                  <Table.Cell>
                    {room.data.members ? (
                      <div className="flex flex-wrap">
                        {room.data.members.map((memberId) => (
                          <div key={memberId} className="flex items-center bg-gray-200 p-1 m-1 rounded">
                            <span className="mr-2">{users[memberId]?.displayName || memberId}</span>
                            <HiX className="text-red-500 cursor-pointer" onClick={() => handleRemoveMember(room.id, memberId)} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      "No members"
                    )}
                  </Table.Cell>
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
                  <Table.Cell>
                    <HiPencilAlt className="text-blue-500 cursor-pointer" onClick={() => handleEditRoom(room)} />
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
                Yes, I&#x27;m sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onClose={() => setShowEditModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <div>
              <Label htmlFor="roomName" value="Name" />
              <TextInput id="roomName" value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="roomImage" value="Image" />
              <input id="roomImage" type="file" onChange={(e) => setNewRoomImage(e.target.files[0])} />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleUpdateRoom}>Update Room</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
