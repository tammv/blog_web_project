import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';

function HighlightedText({ text, highlight }) {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={index} className="bg-yellow-200">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
}

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [userIdToUpdate, setUserIdToUpdate] = useState('');
  const [updateType, setUpdateType] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [userIdToBan, setUserIdToBan] = useState('');
  const [banAction, setBanAction] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUpdateUserToAdmin = async () => {
    try {
      const res = await fetch(`/api/user/${userIdToUpdate}/admin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        if (res.ok) {
          setUsers((prev) =>
            prev.map((user) =>
              user._id === userIdToUpdate ? { ...user, isAdmin: true } : user
            )
          );
          setShowModal(false);
        } else {
          console.log(data.message);
        }
      } else {
        console.log('Response is not JSON');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleBanUnbanUser = async () => {
    try {
      const res = await fetch(`/api/user/${banAction}/${userIdToBan}`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userIdToBan ? { ...user, isBan: banAction === 'ban' } : user
          )
        );
        setShowModal(false);
      } else {
        setMessage(data.message);
        setShowMessageModal(true);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      {currentUser.isAdmin && filteredUsers.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Promote</Table.HeadCell>
              <Table.HeadCell>Block</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            {filteredUsers.map((user) => (
              <Table.Body className='divide-y' key={user._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <HighlightedText text={user.username} highlight={searchQuery} />
                  </Table.Cell>
                  <Table.Cell>
                    <HighlightedText text={user.email} highlight={searchQuery} />
                  </Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className='text-green-500' />
                    ) : (
                      <FaTimes className='text-red-500' />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {!user.isAdmin && (
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setUserIdToUpdate(user._id);
                          setUpdateType('admin');
                        }}
                        className='font-medium text-blue-500 hover:underline cursor-pointer'
                      >
                        Make Admin
                      </span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {user.isBan ? (
                      <span
                        onClick={() => {
                          if (user.isAdmin) {
                            setMessage('Can not ban Admin!');
                            setShowMessageModal(true);
                          } else {
                            setShowModal(true);
                            setUserIdToBan(user._id);
                            setBanAction('unban');
                          }
                        }}
                        className='font-medium text-green-500 hover:underline cursor-pointer'
                      >
                        Unban
                      </span>
                    ) : (
                      <span
                        onClick={() => {
                          if (user.isAdmin) {
                            setMessage('Can not ban Admin!');
                            setShowMessageModal(true);
                          } else {
                            setShowModal(true);
                            setUserIdToBan(user._id);
                            setBanAction('ban');
                          }
                        }}
                        className='font-medium text-red-500 hover:underline cursor-pointer'
                      >
                        Ban
                      </span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        if (user.isAdmin) {
                          setMessage('Can not delete Admin!');
                          setShowMessageModal(true);
                        } else {
                          setShowModal(true);
                          setUserIdToDelete(user._id);
                          setUpdateType('delete');
                        }
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>No users found!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              {banAction ? `Are you sure you want to ${banAction} this user?` : 'Are you sure you want to delete this user?'}
            </h3>
            <div className='flex justify-center gap-4'>
              {banAction ? (
                <Button color='failure' onClick={handleBanUnbanUser}>
                  Yes, I&#x27;m sure
                </Button>
              ) : (
                <Button color='failure' onClick={handleDeleteUser}>
                  Yes, I&#x27;m sure
                </Button>
              )}
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              {message}
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='gray' onClick={() => setShowMessageModal(false)}>
                Ok
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
