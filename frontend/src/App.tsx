import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Signin from "./pages/BeforePage/SignInPage";
import Landing from "./pages/BeforePage/MainPage";
import HomePage from "./pages/HomePage/HomePage";
import DashboardPage from "./pages/AdminPage/DashboardPage";
import UploadMovie from "./pages/AdminPage/UploadMovie";
import MovieDetailPage from "./pages/HomePage/MovieDetailPage";
import Account from "./pages/MyPage/Account";
import AccountDelete from "./components/Mypage/AccountDelete";
import LoginPage from "./pages/BeforePage/LoginPage";
import SubscribePage from "./pages/BeforePage/SubscribePage";
import Pwlogin from "./components/BeforePage/PasswordLogin-form";
import PwloginPage from "./pages/BeforePage/PwLogin";
import PwLogin from "./pages/BeforePage/PwLogin";
import ProfileSelectionPage from "./pages/BeforePage/ProfileSelectionPage";

function App() {
  const location = useLocation();
  const pathname = location.pathname;
  const [userId, setUserId] = useState<string | null>(null);
  const [userNo, setUserNo] = useState<number | null>(null);

  // 로그인 처리 함수
  const handleLogin = (id: string, no: number) => {
    setUserId(id);
    setUserNo(no);
  };


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
    <Routes>
      <Route path="/signin" element={<Signin />} />
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/dashboard/*" element={<DashboardPage />} />
      <Route path="/upload" element={<UploadMovie />} />
      <Route path="/movie/:movieId" element={<MovieDetailPage />} />
      <Route path="/account" element={<Account />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/subscribe" element={<SubscribePage />} />
      <Route path="/passwordlogin" element={<PwLogin />} />
      <Route path="/profiles" element={<ProfileSelectionPage />} />
    </Routes>
  );
}

export default App;
