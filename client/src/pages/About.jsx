import { useSelector } from "react-redux";

export default function About() {
  const { theme } = useSelector((state) => state.theme);
  return (
    <section className={`py-10 sm:py-16 lg:py-24 ${theme === "dark" ? "dark:bg-gray-900" : ""}`}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h1
              className={`text-4xl font-bold sm:text-6xl lg:text-7xl ${theme === "dark" ? "text-white" : "text-black"}`}
            >
              Welcome to DEVB – Your Gateway to the World of Technology
              {/* <div className="relative inline-flex">
                <span className="absolute inset-x-0 bottom-0 border-b-[30px] border-[#4ADE80]"></span>
                <h1
                  className={`relative text-4xl font-bold sm:text-6xl lg:text-7xl ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Postcrafts.
                </h1>
              </div> */}
            </h1>

            <p className={`mt-8 text-base sm:text-xl ${theme === "dark" ? "text-gray-300" : "text-black"}`}>
              Our mission is to create a platform where technology enthusiasts can connect, collaborate, and share their
              knowledge. We aim to foster a community where learning is continuous, and innovation is at the forefront.
            </p>

            <div className="mt-10 sm:flex sm:items-center sm:space-x-8">
              <a
                href="#"
                title=""
                className={`inline-flex items-center justify-center px-10 py-4 text-base font-semibold transition-all duration-200 ${
                  theme === "dark"
                    ? "text-white bg-orange-600 hover:bg-orange-700 focus:bg-orange-700"
                    : "text-white bg-orange-500 hover:bg-orange-600 focus:bg-orange-600"
                }`}
                role="button"
              >
                {" "}
                Start exploring{" "}
              </a>
            </div>
          </div>

          <div>
            <img
              className="w-full"
              src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/2/hero-img.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
}
