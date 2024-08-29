import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Signin from "./pages/BeforePage/SignInPage";
import HomePage from "./pages/HomePage/HomePage";
import DashboardPage from "./pages/AdminPage/DashboardPage";
import UploadMovie from "./pages/AdminPage/UploadMovie";
import MovieDetailPage from "./pages/HomePage/MovieDetailPage";
import Account from "./pages/MyPage/Account";
import LoginPage from "./pages/BeforePage/LoginPage";
import SubscribePage from "./pages/BeforePage/SubscribePage";
import PwLogin from "./pages/BeforePage/PwLogin";
import HelpPage from "./pages/MyPage/Help";
import Profiles from "./pages/BeforePage/Profiles";
import SubscribeSuccess from "./pages/HomePage/SubscribeSuccess";
import Findidpage from "./pages/BeforePage/findidpage";
import Findpwpage from "./pages/BeforePage/findpwpage";
import MembershipCancel from "./components/Mypage/MembershipCancel";
import HeartList from "./components/Mypage/HeartList";
"./pages/BeforePage/findpwpage";
import Landing from "./pages/BeforePage/MainPage";
import EasterEgg from "./EasterEgg/EasterEgg";
import ProtectedRoute from "../src/Auth/ProtectedRoute";
import PublicRoute from "../src/Auth/publicRoute";

function App() {
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "Landing Page";
        metaDescription = "This is the landing page description.";
        break;
      case "/signin":
        title = "Sign In";
        metaDescription = "This is the sign-in page description.";
        break;
      case "/dashboard":
      case "/dashboard/movieManage":
      case "/dashboard/insertMovie":
      case "/dashboard/memberManage":
      case "/dashboard/FAQManage":
      case "/dashboard/1on1chat":
        title = "Dashboard";
        metaDescription = "This is the dashboard page description.";
        break;
      case "/upload":
        title = "Upload Movie";
        metaDescription = "Upload a new movie.";
        break;
      default:
        title = "CinemaCloud";
        metaDescription = "Default description.";
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      ) as HTMLMetaElement;

      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Routes>
        {/* 로그인 안했을 때 접근 가능 */}
        <Route path="/signin" element={<PublicRoute element={<Signin />} />} />
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />
        <Route path="/passwordlogin" element={<PublicRoute element={<PwLogin />} />} />
        <Route path="/Findidpage" element={<PublicRoute element={<Findidpage />} />} />
        <Route path="/Findpwdpage" element={<PublicRoute element={<Findpwpage />} />} />
        {/* 구독 관련 페이지: 누구나 접근 가능 */}
        <Route path="/subscribe" element={<SubscribePage />} />
        <Route path="/heart-list" element={<HeartList profileNo={1} />} />
        <Route path="/subscribe/success" element={<SubscribeSuccess />} />
        <Route path="/profiles" element={<Profiles />} />
        {/* 로그인 했을 때 접근 가능 */}
        <Route path="/home" element={<ProtectedRoute element={<HomePage />} requiredRole="user" />} />
        <Route path="/movie/:movieId" element={<ProtectedRoute element={<MovieDetailPage />} requiredRole="user" />} />
        <Route path="/account" element={<ProtectedRoute element={<Account />} requiredRole="user" />} />
        <Route path="/help" element={<ProtectedRoute element={<HelpPage />} requiredRole="user" />} />
        <Route path="/easterEgg" element={<ProtectedRoute element={<EasterEgg />} requiredRole="user" />} />
        {/* 관리자만 접근 가능 */}
        <Route path="/dashboard/*" element={<ProtectedRoute element={<DashboardPage />} requiredRole="admin" />} />
        <Route path="/upload" element={<ProtectedRoute element={<UploadMovie />} requiredRole="admin" />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
