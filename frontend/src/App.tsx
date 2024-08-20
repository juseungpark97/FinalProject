import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
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
import Findpwpage from "./pages/BeforePage/findpwpage";

function App() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 로그인 상태 확인 (토큰이 있는지 확인)
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token); // 토큰이 있으면 true, 없으면 false
  }, [pathname]);

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
        {/* 로그인되지 않은 사용자만 접근 가능한 페이지들 */}
        <Route
          path="/signin"
          element={
            !isAuthenticated ? <Signin /> : <Navigate to="/profiles" replace />
          }
        />
        <Route
          path="/"
          element={
            !isAuthenticated ? <Landing /> : <Navigate to="/profiles" replace />
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? <LoginPage /> : <Navigate to="/profiles" replace />
          }
        />
        <Route
          path="/passwordlogin"
          element={
            !isAuthenticated ? <PwLogin /> : <Navigate to="/profiles" replace />
          }
        />
        <Route
          path="/findidpage"
          element={
            !isAuthenticated ? <Findidpage /> : <Navigate to="/profiles" replace />
          }
        />
        <Route
          path="/findpwpage"
          element={
            !isAuthenticated ? <Findpwpage /> : <Navigate to="/profiles" replace />
          }
        />

        {/* 로그인된 사용자만 접근 가능한 페이지들 */}
        <Route
          path="/home"
          element={
            isAuthenticated ? <HomePage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/account"
          element={
            isAuthenticated ? <Account /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/help"
          element={
            isAuthenticated ? <HelpPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/subscribe"
          element={
            isAuthenticated ? <SubscribePage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/profiles"
          element={
            isAuthenticated ? <Profiles /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/subscribe/success"
          element={
            isAuthenticated ? <SubscribeSuccess /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/movie/:movieId"
          element={
            isAuthenticated ? <MovieDetailPage /> : <Navigate to="/" replace />
          }
        />

        {/* 로그인 여부와 상관없이 접근 가능한 페이지들 */}
        <Route path="/dashboard/*" element={<DashboardPage />} />
        <Route path="/upload" element={<UploadMovie />} />

        {/* 잘못된 URL 접근 시 기본 리디렉션 */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/profiles" : "/"} replace />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
