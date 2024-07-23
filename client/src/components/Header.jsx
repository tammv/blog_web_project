import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun, FaComment } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice.js";
import { signoutSuccess } from "../redux/user/userSlice.js";

export default function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch(); // Add this line
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme); // Add this line

  const navigate = useNavigate();

  const handleChatClick = () => {
      if (currentUser && (!currentUser.isPremium || !currentUser.isAdmin)) {
        navigate("/payment");
      } else {
        navigate("/rooms");
      }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Navbar className="border-b-2">
      <Link to="/" className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          DevB
        </span>
        Blog
      </Link>

      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill onClick={handleChatClick}>
          <FaComment />
        </Button>
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill onClick={() => dispatch(toggleTheme())}>
          {" "}
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown arrowIcon={false} inline label={<Avatar alt="user" img={currentUser.profilePicture} rounded />}>
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">@{currentUser.email}</span>
            </Dropdown.Header>
            <Link to={currentUser.isAdmin ? "/dashboardadmin?tab=profile" : "/dashboard?tab=profile"}>
              {currentUser.isAdmin ? <Dropdown.Item>Dashboard</Dropdown.Item> : <Dropdown.Item>Setting</Dropdown.Item>}
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/blogs"} as={"div"}>
          <Link to="/blogs">Blogs</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/quiz"} as={"div"}>
          <Link to="/quiz">Quizz</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/videos"} as={"div"}>
          <Link to="/videos">Videos</Link>
        </Navbar.Link>
        {currentUser && !currentUser.isAdmin && !currentUser.isPremium && (
          <Navbar.Link active={path === "/payment"} as={"div"}>
            <Link to="/payment">Payment</Link>
          </Navbar.Link>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
