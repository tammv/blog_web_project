import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react"; // Assuming you use 'flowbite-react' for styling

// HighlightedText component to highlight the search query
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

const ListVideo = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [videosPerPage] = useState(8); // Number of videos per page
  const [searchQuery, setSearchQuery] = useState(""); // Add search query state
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

  // Filter videos based on search query
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 shadow-md">
      {/* Always display the search input */}
      <input
        type="text"
        placeholder="Search videos by title"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
          {filteredVideos.map((video) => (
            <div
              key={video._id}
              className="border border-gray-300 rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-transform duration-200 active:scale-95"
              onClick={() => handleCardClick(video._id)}
            >
              <img src={video.img} alt={video.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="font-bold text-xl mb-2">
                  <HighlightedText text={video.title} highlight={searchQuery} />
                </h2>
                <p className="text-gray-700 text-base">{video.userId.username}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">No videos found</div>
      )}

      <div className="flex text-center justify-center mt-10">
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
