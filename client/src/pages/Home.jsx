import React from "react";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import { useSelector } from "react-redux";

export default function Home() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div>
      <div>
        {currentUser.isAdmin && (
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
      </div>
      <div>
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
                      <Link to={"/create-post"}>
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
      </div>

      <section className="py-10 bg-gray-50 sm:py-16 lg:py-24 dark:bg-gray-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl dark:text-white">
                Latest from blog
              </h2>
            </div>
            <div className="hidden lg:flex lg:items-center lg:space-x-3">
              <button
                type="button"
                className="flex items-center justify-center text-gray-400 transition-all duration-200 bg-transparent border border-gray-300 rounded w-9 h-9 hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white dark:border-gray-600 dark:hover:bg-blue-500 dark:focus:bg-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                className="flex items-center justify-center text-gray-400 transition-all duration-200 bg-transparent border border-gray-300 rounded w-9 h-9 hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white dark:border-gray-600 dark:hover:bg-blue-500 dark:focus:bg-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 mt-8 lg:mt-12 lg:grid-cols-2 xl:grid-cols-3 lg:gap-8">
            <div className="overflow-hidden bg-white rounded-md shadow dark:bg-gray-900">
              <div className="p-8 xl:p-10">
                <div className="inline-flex items-center px-3 py-2 text-xs font-semibold leading-5 text-blue-600 bg-blue-100 rounded-full dark:text-blue-400 dark:bg-gray-700">
                  Tech
                </div>
                <p className="mt-5 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                  12 Jan 2024
                </p>
                <h4 className="mt-5 text-2xl font-semibold text-black dark:text-white">
                  <a href="#" title="" className="hover:underline">
                    Đánh giá rủi ro bảo mật của các dịch vụ trực tuyến
                  </a>
                </h4>
                <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
                  Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis
                  enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
                </p>
                <p className="mt-4 text-base font-semibold text-black dark:text-white">Joseph Metcalf</p>
              </div>
            </div>

            <div className="overflow-hidden bg-white rounded-md shadow dark:bg-gray-900">
              <div className="p-8 xl:p-10">
                <div className="inline-flex items-center px-3 py-2 text-xs font-semibold leading-5 text-emerald-600 bg-emerald-100 rounded-full dark:text-emerald-400 dark:bg-gray-700">
                  Management
                </div>
                <p className="mt-5 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                  10 Jan 2024
                </p>
                <h4 className="mt-5 text-2xl font-semibold text-black dark:text-white">
                  <a href="#" title="" className="hover:underline">
                    5 lỗi quản lý phổ biến nhất trong các dự án phần mềm
                  </a>
                </h4>
                <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
                  Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis
                  enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
                </p>
                <p className="mt-4 text-base font-semibold text-black dark:text-white">Hannah Parker</p>
              </div>
            </div>

            <div className="overflow-hidden bg-white rounded-md shadow dark:bg-gray-900">
              <div className="p-8 xl:p-10">
                <div className="inline-flex items-center px-3 py-2 text-xs font-semibold leading-5 text-red-600 bg-red-100 rounded-full dark:text-red-400 dark:bg-gray-700">
                  Development
                </div>
                <p className="mt-5 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                  07 Jan 2024
                </p>
                <h4 className="mt-5 text-2xl font-semibold text-black dark:text-white">
                  <a href="#" title="" className="hover:underline">
                    Tối ưu hóa hiệu suất của các ứng dụng web
                  </a>
                </h4>
                <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
                  Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis
                  enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
                </p>
                <p className="mt-4 text-base font-semibold text-black dark:text-white">Michael Fischer</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
