import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

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

export default function DashSavePost() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToRemove, setPostIdToDelete] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/save/saved/${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data);
          if (data.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchPosts();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`/api/save/saved/${currentUser._id}?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data]);
        if (data.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleRemovePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/save/removeSavedPost/${postIdToRemove}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToRemove));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const filteredPosts = userPosts.filter(
    (post) =>
      post.postId.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.postId.topicID.nameOfTopic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <input
        type="text"
        placeholder="Search posts title or topic"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      {filteredPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>DATE SAVED</Table.HeadCell>
              <Table.HeadCell>POST IMAGE</Table.HeadCell>
              <Table.HeadCell>POST TITLE</Table.HeadCell>
              <Table.HeadCell>TOPIC</Table.HeadCell>
              <Table.HeadCell>REMOVE</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {filteredPosts.map((savedpost) => (
                <Table.Row
                  key={savedpost._id} // Add a unique key to each Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>{new Date(savedpost.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${savedpost.postId.slug}`}>
                      <img src={savedpost.postId.image} alt={savedpost.postId.title} className="w-20 h-10 object-cover bg-gray-500" />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className="font-medium text-gray-900 dark:text-white" to={`/post/${savedpost.postId.slug}`}>
                      <HighlightedText text={savedpost.postId.title} highlight={searchQuery} />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <HighlightedText text={savedpost.postId.topicID.nameOfTopic} highlight={searchQuery} />
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(savedpost._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Remove
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no saved posts yet!</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to remove this saved post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleRemovePost}>
                Yes, I&#x27;m sure
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
