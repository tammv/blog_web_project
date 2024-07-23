import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
  HiClipboardList,
  HiArchive,
  HiVideoCamera,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

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
    <Sidebar className="w-full md:w-60">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser && currentUser.isAdmin ? (
            <>
              <Link to="/dashboardadmin?tab=dash">
                <Sidebar.Item active={tab === "dash" || !tab} icon={HiChartPie} as="div">
                  Dashboard
                </Sidebar.Item>
              </Link>
              <Link to="/dashboardadmin?tab=postsadmin">
                <Sidebar.Item active={tab === "posts"} icon={HiDocumentText} as="div">
                  Posts
                </Sidebar.Item>
              </Link>
              <Link to="/dashboardadmin?tab=quizzesadmin">
                <Sidebar.Item active={tab === "quizzes"} icon={HiClipboardList} as="div">
                  Quiz
                </Sidebar.Item>
              </Link>
              <Link to="/dashboardadmin?tab=videosadmin">
                <Sidebar.Item active={tab === "videos"} icon={HiVideoCamera} as="div">
                  Videos
                </Sidebar.Item>
              </Link>
              <Link to="/dashboardadmin?tab=users">
                <Sidebar.Item active={tab === "users"} icon={HiOutlineUserGroup} as="div">
                  Users
                </Sidebar.Item>
              </Link>
              <Link to="/dashboardadmin?tab=comments">
                <Sidebar.Item active={tab === "comments"} icon={HiAnnotation} as="div">
                  Comments
                </Sidebar.Item>
              </Link>
              <Link to="/dashboardadmin?tab=reports">
                <Sidebar.Item active={tab === "reports"} icon={HiAnnotation} as="div">
                  Reports
                </Sidebar.Item>
              </Link>
              <Link to="/dashboardadmin?tab=topic">
                <Sidebar.Item active={tab === "topic"} icon={HiAnnotation} as="div">
                  Topics
                </Sidebar.Item>
              </Link>
              <Link to="/dashboardadmin?tab=rooms">
                <Sidebar.Item active={tab === "rooms"} icon={HiAnnotation} as="div">
                  Rooms Chat
                </Sidebar.Item>
              </Link>
            </>
          ) : (
            <Link to="/dashboard?tab=profile">
              <Sidebar.Item
                active={tab === "profile"}
                icon={HiUser}
                label={currentUser.isAdmin ? "Admin" : currentUser.isPremium ? "Premium" : "User"}
                labelColor="dark"
                as="div"
              >
                Profile
              </Sidebar.Item>
              <Link to="/dashboard?tab=posts">
                <Sidebar.Item active={tab === "posts"} icon={HiDocumentText} as="div">
                  Posts
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=videos">
                <Sidebar.Item active={tab === "videos"} icon={HiVideoCamera} as="div">
                  Videos
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=quizzes">
                <Sidebar.Item active={tab === "quizzes"} icon={HiClipboardList} as="div">
                  Quiz
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=savedpost">
                <Sidebar.Item active={tab === "savedpost"} icon={HiArchive} as="div">
                  Saved Post
                </Sidebar.Item>
              </Link>
            </Link>
          )}
          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer" onClick={handleSignout} as="div">
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
