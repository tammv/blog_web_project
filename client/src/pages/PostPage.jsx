import { Button, Spinner, Modal, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
import TopicList from "../components/TopicList";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportContent, setReportContent] = useState("");

  const [isReportSuccess, setIsReportSuccess] = useState(false);
  const [userId, setUserId] = useState(null); // State để lưu userId

  useEffect(() => {
    // Dynamic import jwt-decode
    const importJwtDecode = async () => {
      const module = await import("jwt-decode");
      jwtDecode = module.default; // Truy cập default export
    };
    importJwtDecode();
  }, []);

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

  useEffect(() => {
    // Hàm lấy userId từ token
    const decodeToken = () => {
      const token = localStorage.getItem("token"); // Giả sử token được lưu trữ trong localStorage
      if (token && jwtDecode) {
        // Đảm bảo jwtDecode đã được import
        const decoded = jwtDecode(token); // Sử dụng jwtDecode
        setUserId(decoded.id); // Lưu userId vào state
      }
    };
    decodeToken();
  }, [jwtDecode]); // Thực hiện decodeToken khi jwtDecode được import

  // Hàm mở Modal báo cáo
  const openReportModal = () => {
    setIsReportModalOpen(true);
  };

  // Hàm đóng Modal báo cáo
  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setReportContent("");
  };
  const showSuccessMessage = () => {
    setIsReportSuccess(true);
    setTimeout(() => {
      setIsReportSuccess(false);
    }, 5000); // Đặt thời gian tồn tại là 5 giây (5000 miliseconds)
  };
  // Hàm gửi báo cáo
  const submitReport = async () => {
    try {
      const response = await fetch("/api/report/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: post._id,
          content: reportContent,
          userId: userId,
        }),
      });

      if (response.ok) {
        setIsReportSuccess(true);
        closeReportModal();
        showSuccessMessage();
      } else {
        // Xử lý lỗi nếu có
        console.error("Gửi báo cáo thất bại");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

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
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className="max-w-2xl mx-auto w-full">
        {post && <CallToAction />} {/* Đảm bảo rằng thành phần CallToAction chỉ được render khi có dữ liệu post */}
      </div>
      {post && <CommentSection postId={post._id} />}

      {/* Nút báo cáo */}
      <div className="max-w-2xl mx-auto w-full mt-4 flex justify-end">
        <Button color="red" onClick={openReportModal}>
          Báo cáo
        </Button>
      </div>

      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent articles</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {recentPosts && recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>

      {/* Modal báo cáo */}
      <Modal show={isReportModalOpen} onClose={closeReportModal}>
        <Modal.Header>Báo cáo bài đăng</Modal.Header>
        <Modal.Body>
          <Textarea
            placeholder="Nhập nội dung báo cáo của bạn..."
            rows={4}
            value={reportContent}
            onChange={(e) => setReportContent(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={closeReportModal}>
            Hủy
          </Button>
          <button color="red " onClick={submitReport}>
            Gửi báo cáo
          </button>
        </Modal.Footer>
      </Modal>

      {isReportSuccess && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 p-2 bg-green-500 text-white rounded shadow-md">
          Báo cáo đã được gửi thành công!
        </div>
      )}
    </main>
  );
}
