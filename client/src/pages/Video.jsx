import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Modal, Textarea } from "flowbite-react"; // Assuming 'flowbite-react' provides the Button and Modal components
import { useSelector } from "react-redux"; // Import useSelector to get current user information from the Redux store

const VideoComponent = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const [isReportSuccess, setIsReportSuccess] = useState(false);
  const { currentUser } = useSelector((state) => state.user); // Get current user from Redux store

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`/api/video/getVideo/${videoId}`);
        const data = await res.json();
        if (res.ok) {
          setVideo(data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  const openReportModal = () => {
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setReportContent("");
  };

  const showSuccessMessage = () => {
    setIsReportSuccess(true);
    setTimeout(() => {
      setIsReportSuccess(false);
    }, 5000);
  };

  const submitReport = async () => {
    try {
      const response = await fetch("/api/report/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referenceId: video._id, // Assuming video._id is the ID of the video
          referenceType: "Video", // Set the referenceType to "Video" for video reports
          content: reportContent,
          userId: currentUser._id, // Assuming currentUser._id is the ID of the current user
        }),
      });

      if (response.ok) {
        setIsReportSuccess(true);
        closeReportModal();
        showSuccessMessage();
      } else {
        console.error("Report submission failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!video) return <div>No video found</div>;

  return (
    <div className="p-6 bg-slate-600 rounded-lg shadow-md grid grid-cols-5 gap-5">
      <div className="col-span-3">
        <iframe
          width="100%"
          height="315"
          src={video.url}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        <p className="text-slate-200 my-4 font-bold justify-self-end">Author: {video.userId.username}</p>
      </div>
      <div className="col-span-2">
        <h2 className="text-2xl font-bold mb-4">{video.title}</h2>
        <p className="text-slate-200 mb-4">{video.content}</p>
        {currentUser && currentUser.isAdmin && (
          <div className="flex justify-end">
            <Button color="red" onClick={openReportModal}>
              Report Video
            </Button>
          </div>
        )}
      </div>

      <Modal show={isReportModalOpen} onClose={closeReportModal}>
        <Modal.Header>Report Video</Modal.Header>
        <Modal.Body>
          <Textarea
            placeholder="Enter your report content..."
            rows={4}
            value={reportContent}
            onChange={(e) => setReportContent(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={closeReportModal}>
            Cancel
          </Button>
          <Button color="red" onClick={submitReport}>
            Submit Report
          </Button>
        </Modal.Footer>
      </Modal>

      {isReportSuccess && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 p-2 bg-green-500 text-white rounded shadow-md">
          Report successfully submitted!
        </div>
      )}
    </div>
  );
};

export default VideoComponent;
