import { Button, Spinner, Modal, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
import TopicList from "../components/TopicList";
import { useSelector } from "react-redux";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const [isReportSuccess, setIsReportSuccess] = useState(false);
  const [userId, setUserId] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [isPremium, setIsPremium] = useState(false); // State to manage premium status
  const [isSaveSuccess, setIsSaveSuccess] = useState(false); // State to manage save success

  useEffect(() => {
    // Dynamic import jwt-decode
    let jwtDecode;
    const importJwtDecode = async () => {
      const module = await import("jwt-decode");
      jwtDecode = module.default;
      decodeToken(); // Decode token after importing jwt-decode
    };
    importJwtDecode();
  }, []);

  useEffect(() => {
    if (currentUser) {
      setIsPremium(currentUser.isPremium);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchRecentPosts();
  }, []);

  const decodeToken = () => {
    const token = localStorage.getItem("token");
    if (token && jwtDecode) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
      setIsPremium(decoded.isPremium); // Set premium status
    }
  };

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
          referenceId: post._id, // Ensure this matches the backend's expectation
          referenceType: "Post", // Adjust as per your logic (could be dynamic based on UI)
          content: reportContent,
          userId: userId,
        }),
      });
      if (response.ok) {
        setIsReportSuccess(true);
        closeReportModal();
        showSuccessMessage();
      } else {
        console.error("Report submission failed:", await response.json());
        // Log more details about the response for debugging
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network errors or exceptions during fetch
    }
  };

  const savePost = async () => {
    try {
      const response = await fetch("/api/save/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: post._id,
          userId: currentUser._id,
        }),
      });
      if (response.ok) {
        setIsSaveSuccess(true);
        setTimeout(() => {
          setIsSaveSuccess(false);
        }, 5000);
      } else {
        console.error("Save post failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  const content = post && post.content;
  const halfContent = content && content.slice(0, Math.floor(content.length / 2));

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <TopicList />
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">{post && post.title}</h1>
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">{post && (post.content.length / 1000).toFixed(0)} mins read</span>
      </div>
      <img src={post && post.image} alt={post && post.title} className="mt-10 p-3 max-h-[600px] w-full object-cover" />

      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: isPremium ? content : halfContent }}
      ></div>
      {!isPremium && (
        <div className="text-center my-5">
          <Link to="/payment" className="font-bold text-blue-500 underline">
            Subscribe for full content
          </Link>
        </div>
      )}
      <div className="max-w-2xl mx-auto w-full">{post && <CallToAction />}</div>
      {post && <CommentSection postId={post._id} />}

      <div className="max-w-2xl mx-auto w-full mt-4 flex justify-end">
        <Button color="red" onClick={openReportModal}>
          Report
        </Button>
        <Button color="blue" onClick={savePost} className="ml-3">
          Save Post
        </Button>
      </div>

      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent articles</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {recentPosts && recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>

      <Modal show={isReportModalOpen} onClose={closeReportModal}>
        <Modal.Header>Report Post</Modal.Header>
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
      {isSaveSuccess && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 p-2 bg-green-500 text-white rounded shadow-md">
          Post saved successfully!
        </div>
      )}
    </main>
  );
}
