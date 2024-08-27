import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google'; // 구글 인증관련
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
import findpwpage from "./pages/BeforePage/findpwpage";
import Findpwpage from "./pages/BeforePage/findpwpage";
import MembershipCancel from "./components/Mypage/MembershipCancel";
import Landing from "./pages/BeforePage/MainPage";
import EasterEgg from "./EasterEgg/EasterEgg";
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
        <Route path="/signin" element={<Signin />} />  {/* 로그인 전 */}
        <Route path="/" element={<Landing />} /> {/* 로그인 전 */}
        <Route path="/home" element={<HomePage />} /> {/* 로그인 후 */}
        <Route path="/dashboard/*" element={<DashboardPage />} /> {/* 로그인 후 USER테이블의 roll이 admin인 계정일때 */}
        <Route path="/upload" element={<UploadMovie />} /> {/* 로그인 후 USER테이블의 roll이 admin인 계정일때 */}
        <Route path="/movie/:movieId" element={<MovieDetailPage />} /> {/* 로그인 후 */}
        <Route path="/account" element={<Account />} /> {/* 로그인 후 */}
        <Route path="/help" element={<HelpPage />} /> {/* 로그인 후 */}
        <Route path="/login" element={<LoginPage />} /> {/* 로그인 전 */}
        <Route path="/subscribe" element={<SubscribePage />} /> {/* 로그인 후 */}
        <Route path="/passwordlogin" element={<PwLogin />} /> {/* 로그인 전 */}
        <Route path="/profiles" element={<Profiles />} /> {/* 로그인 후 */}
        <Route path="/Findidpage" element={<Findidpage />} /> {/* 로그인 전 */}
        <Route path="/Findpwdpage" element={<Findpwpage />} /> {/* 로그인 전 */}
        <Route path="/subscribe/success" element={<SubscribeSuccess />} /> {/* 로그인 후 */}
        <Route path="/easterEgg" element={<EasterEgg />} /> {/* 로그인 후 */}
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;