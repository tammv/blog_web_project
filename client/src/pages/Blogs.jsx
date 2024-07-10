import React, { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import { Button } from "flowbite-react";

export default function Blogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/post/getposts?startIndex=${(currentPage - 1) * postsPerPage}&limit=${postsPerPage}`
        ); // Replace with your API endpoint
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPages(Math.ceil(data.totalPosts / postsPerPage));
        } else {
          setError(true);
        }
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

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

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen">Failed to load posts.</div>;
  }

  return (
    <main className="p-5 max-w-6xl mx-auto">
      <h1 className="text-3xl text-center font-bold mb-10">All Blog Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div
            key={post._id}
            className="post-card bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <PostCard post={post} />
          </div>
        ))}
      </div>
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
    </main>
  );
}
