import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google'; // 구글 인증관련
import Signin from "./pages/BeforePage/SignInPage";
import Landing from "./pages/BeforePage/MainPage";
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
import findpwpage from "./pages/BeforePage/findpwpage";
import Findpwpage from "./pages/BeforePage/findpwpage";
"./pages/BeforePage/findpwpage";

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
        break; // 'break' 추가
      case "/upload":
        title = "Upload Movie";
        metaDescription = "Upload a new movie.";
        break;
      default:
        title = "Default Title";
        metaDescription = "Default description.";
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag: HTMLMetaElement | null = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard/*" element={<DashboardPage />} />
        <Route path="/upload" element={<UploadMovie />} />
        <Route path="/movie/:movieId" element={<MovieDetailPage />} />
        <Route path="/account" element={<Account />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/subscribe" element={<SubscribePage />} />
        <Route path="/passwordlogin" element={<PwLogin />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/Findidpage" element={<Findidpage />} />
        <Route path="/Findpwdpage" element={<Findpwpage />} />


        <Route path="/subscribe/success" element={<SubscribeSuccess />} /> {/* 구독 성공 페이지 경로 추가 */}
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;