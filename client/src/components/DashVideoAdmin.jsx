import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashVideosAdmin() {
    const { currentUser } = useSelector((state) => state.user);
    const [userVideos, setUserVideos] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [videoIdToDelete, setVideoIdToDelete] = useState("");

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await fetch(`/api/video/getVideos`);
                const data = await res.json();
                if (res.ok) {
                    setUserVideos(data.videos);
                    if (data.videos.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchVideos();
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = userVideos.length;
        try {
            const res = await fetch(`/api/video/getVideos?userId=${currentUser._id}&startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setUserVideos((prev) => [...prev, ...data.videos]);
                if (data.videos.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeleteVideo = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/video/deleteVideo/${videoIdToDelete}/${currentUser._id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setUserVideos((prev) => prev.filter((video) => video._id !== videoIdToDelete));
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            {userVideos.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Date updated</Table.HeadCell>
                            <Table.HeadCell>Video image</Table.HeadCell>
                            <Table.HeadCell>Video title</Table.HeadCell>
                            <Table.HeadCell>Content</Table.HeadCell>
                            <Table.HeadCell>Author</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {userVideos.map((video) => (
                                <Table.Row
                                    key={video._id} // Add a unique key to each Table.Row
                                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <Table.Cell>{new Date(video.updatedAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/video/${video._id}`}>
                                            <img src={video.img} alt={video.title} className="w-20 h-10 object-cover bg-gray-500" />
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link className="font-medium text-gray-900 dark:text-white" to={`/video/${video._id}`}>
                                            {video.title}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>{video.content}</Table.Cell>
                                    <Table.Cell>{video.userId.username}</Table.Cell>
                                    <Table.Cell>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setVideoIdToDelete(video._id);
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
                    {showMore && (
                        <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p>You have no videos yet!</p>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this video?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDeleteVideo}>
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
