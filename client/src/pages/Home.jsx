import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Spinner } from "flowbite-react"; // Assuming Spinner is imported from flowbite-react
import { useSelector } from "react-redux";
import axios from "axios";

export default function Home() {
  const { currentUser } = useSelector((state) => state.user);
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); // State to track current index of visible posts

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await axios.get("/api/post/getposts?limit=3"); // Fetch only 3 posts
        setLatestPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching latest posts:", error);
        setError("Error fetching latest posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % latestPosts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + latestPosts.length) % latestPosts.length);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      {!currentUser && (
        <section className="bg-[#FCF8F1] bg-opacity-30 py-10 sm:py-16 lg:py-24 dark:bg-gray-900">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
              <div>
                <p className="text-base font-semibold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                  A Tech Blog for Knowledge Sharing
                </p>
                <h1 className="mt-4 text-4xl font-bold text-black lg:mt-8 sm:text-6xl xl:text-8xl dark:text-white">
                  Connect & Learn from the Experts
                </h1>
                <p className="mt-4 text-base text-black lg:mt-8 sm:text-xl dark:text-gray-300">
                  Accelerate your career growth with insights from industry leaders. Join a community where technology
                  enthusiasts share their knowledge, experiences, and innovations.
                </p>
              </div>
              <div>
                <img
                  className="w-full"
                  src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/1/hero-img.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {currentUser && !currentUser.isAdmin && (
        <section className="py-10 bg-gray-50 sm:py-16 lg:py-24 dark:bg-gray-800">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
              <div className="grid items-center grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-20">
                <div>
                  <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl dark:text-white">
                    Grow us Organization about Technology
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-300">
                    Collaborate and Learn: Engage with other experts and learn from their experiences. <br />
                  </p>

                  {/* Add the button here */}
                  <div className="mt-6">
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-400">Create a new post now</p>
                    <Link to="/create-post">
                      <Button
                        type="button"
                        gradientDuoTone="purpleToPink"
                        className="mt-2 inline-flex items-center justify-center px-6 py-3 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg hover:from-purple-500 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        Create a Post
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="relative pl-20 pr-6 sm:pl-6 md:px-0">
                  <div className="relative w-full max-w-xs mt-4 mb-10 ml-auto">
                    <img
                      className="ml-auto"
                      src="https://cdn.rareblocks.xyz/collection/celebration/images/features/1/person.jpg"
                      alt="Person"
                    />

                    <img
                      className="absolute -top-4 -left-12"
                      src="https://cdn.rareblocks.xyz/collection/celebration/images/features/1/wavey-lines.svg"
                      alt="Decorative wavey lines"
                    />

                    <div className="absolute -bottom-10 -left-16">
                      <div className="bg-yellow-300">
                        <div className="px-8 py-10">
                          <span className="block text-4xl font-bold text-black lg:text-5xl"> 53% </span>
                          <span className="block mt-2 text-base leading-tight text-black dark:text-gray-800">
                            High Conversions
                            <br />
                            Everything
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-10 bg-gray-50 sm:py-16 lg:py-24 dark:bg-gray-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-4">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl dark:text-white">
                Latest from blog
              </h2>
            </div>
            <div className="hidden lg:flex lg:items-center lg:space-x-3">
              {/* Navigation buttons */}
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
              >
                {"<"}
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
              >
                {">"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 mt-8 lg:mt-12 lg:grid-cols-3 gap-8 overflow-x-auto">
            {/* Map over latestPosts with currentIndex */}
            {latestPosts.slice(currentIndex, currentIndex + 3).map((post) => (
              <div key={post._id} className="overflow-hidden bg-white rounded-md shadow dark:bg-gray-900">
                <div className="p-8 xl:p-10">
                  <div
                    className={`inline-flex items-center px-3 py-2 text-xs font-semibold leading-5 text-${post.category}-600 bg-${post.category}-100 rounded-full dark:text-${post.category}-400 dark:bg-gray-700`}
                  >
                    {post.category}
                  </div>
                  <p className="mt-5 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <h4 className="mt-5 text-2xl font-semibold text-black dark:text-white">
                    <Link to={`/post/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h4>

                  <p className="mt-4 text-base font-semibold text-black dark:text-white">{post.userId.username}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
