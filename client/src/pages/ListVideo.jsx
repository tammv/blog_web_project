import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react"; // Assuming you use 'flowbite-react' for styling

const ListVideo = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const videosPerPage = 8; // Number of videos per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/video/getVideos?page=${currentPage}&limit=${videosPerPage}`);
        const data = await res.json();
        if (res.ok) {
          setVideos(data.videos);
          setTotalPages(Math.ceil(data.totalVideos / videosPerPage));
        } else {
          setError("Failed to fetch videos");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [currentPage]); // Trigger fetch on page change

  const handleCardClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (videos.length === 0) return <div>No videos found</div>;

  return (
    <div className="p-6 shadow-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
      {videos.map((video, index) => (
        <div
          key={index}
          className="border border-gray-300 rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-transform duration-200 active:scale-95"
          onClick={() => handleCardClick(video._id)}
        >
          <img src={video.img} alt={video.title} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h2 className="font-bold text-xl mb-2">{video.title}</h2>
            <p className="text-gray-700 text-base">{video.userId.username}</p>
          </div>
        </div>
      ))}

      <div className="flex justify-center mt-10">
        <Button color="blue" onClick={handlePreviousPage} disabled={currentPage === 1} className="mx-1">
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            color="blue"
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 ${currentPage === index + 1 ? "bg-blue-600" : "bg-blue-400"}`}
          >
            {index + 1}
          </Button>
        ))}
        <Button color="blue" onClick={handleNextPage} disabled={currentPage === totalPages} className="mx-1">
          Next
        </Button>
      </div>
    </div>
  );
};

export default ListVideo;
