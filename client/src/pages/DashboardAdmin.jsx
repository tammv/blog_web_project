import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPostsAdmin from "../components/DashPostsAdmin";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";
import DashReports from "../components/DashReport";
import DashTopics from "../components/DashTopic";
import DashChatRooms from "../components/DashChatRooms";
import DashVideosAdmin from "../components/DashVideoAdmin";
import DashQuizzes from "../components/DashQuizzesAdmin";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      {tab === "profile" && <DashProfile />}
      {/* posts... */}
      {tab === "postsadmin" && <DashPostsAdmin />}
      {/* quizzes... */}
      {tab === "quizzesadmin" && <DashQuizzes/>}
      {/* videos... */}
      {tab === "videosadmin" && <DashVideosAdmin />}
      {/* users */}
      {tab === "users" && <DashUsers />}
      {/* comments  */}
      {tab === "comments" && <DashComments />}
      {/* reports  */}
      {tab === "reports" && <DashReports />}
      {/* dashboard topic */}
      {tab === "topic" && <DashTopics />}
      {/* dashboard chat */}
      {tab === "rooms" && <DashChatRooms />}
      {/* dashboard comp */}
      {tab === "dash" && <DashboardComp />}
    </div>
  );
}
