import React, { useState, useEffect } from "react";
import PostCard from "../components/PostCard"; // Adjust the path to your PostCard component
import { Button } from "flowbite-react";

export default function Blogs() {
  const [posts, setPosts] = useState([]);
  const [postsToShow, setPostsToShow] = useState(6); // Initial number of posts to display
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/post/getposts"); // Replace with your API endpoint
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
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
  }, []);

  const loadMorePosts = () => {
    setPostsToShow(postsToShow + 6); // Show 6 more posts when clicking "Show More"
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
        {posts.slice(0, postsToShow).map((post) => (
          <div
            key={post._id}
            className="post-card bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <PostCard post={post} />
          </div>
        ))}
      </div>
      {postsToShow < posts.length && (
        <div className="flex justify-center mt-10">
          <Button onClick={loadMorePosts} color="blue">
            Show More
          </Button>
        </div>
      )}
    </main>
  );
}
