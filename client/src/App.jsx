import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import DashboardAdmin from "./pages/DashboardAdmin";
import SignUp from "./pages/SignUp";
import Blogs from "./pages/Blogs";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import Search from "./pages/Search";
import PaymentPage from "./pages/Payment";
import VideoComponent from "./pages/Video";
import ListVideoComponent from "./pages/ListVideo";
import CreateVideo from "./pages/CreateVideo";
import UpdateVideo from "./pages/UpdateVideo";
import CreateQuiz from "./pages/CreateQuiz";
import QuizPage from "./pages/QuizPage";
import QuizDetail from "./pages/QuizDetail";
import QuizGame from "./pages/QuizGame";
import PaymentSuccess from "./pages/PaymentSuccess";
import ScrollToTopButton from "./components/ScrollToTopButton";
import RoomRoutes from "./chatRoom/RoomRoutes";
import AuthContextProvider from './redux/auth-context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PremiumPrivateRoute from "./components/PremiumPrivateroute";

export default function App() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <ToastContainer />
        <ScrollToTopButton />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/search" element={<Search />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/rooms/*" element={<RoomRoutes />} />
          <Route path="/video/:videoId" element={<VideoComponent />} />
          <Route path="/videos" element={<ListVideoComponent />} />
          <Route path="/createVideo" element={<CreateVideo />} />
          <Route path="/post/:postSlug" element={<PostPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/quiz" element={<QuizPage />}></Route>
          <Route path="/quiz/:quizId" element={<QuizDetail />}></Route>
          <Route path="/game/quiz/:quizId" element={<QuizGame />}></Route>
          <Route path="/success" element={<PaymentSuccess />} />
          {currentUser && currentUser.isAdmin ? (
            <Route element={<OnlyAdminPrivateRoute />}>
              <Route path="/dashboardadmin" element={<DashboardAdmin />} />
            </Route>
          ) : (
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/update-post/:postId" element={<UpdatePost />} />
              <Route path="/update-video/:videoId" element={<UpdateVideo />} />
            </Route>
          )}
          {currentUser && (currentUser.isAdmin || currentUser.isPremium) && (
            <Route element={<PremiumPrivateRoute/>}>
              <Route path="/create-quiz" element={<CreateQuiz />}></Route>
              <Route path="/quiz/:quizId/questions" element={<CreateQuiz />}></Route>
            </Route>
          )}
        </Routes>
        <Footer />
      </AuthContextProvider>
    </BrowserRouter>
  );
}
