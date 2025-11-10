// src/App.js
import React, { useCallback, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Header from "./components/Header";
import Toast from "./components/Toast";
import AuthModal from "./components/AuthModal";

import MainPage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage";
import ReportPage from "./pages/ReportPage";
import MyPage from "./pages/MyPage";
import AdminPage from "./pages/AdminPage";

import {
  readItems,
  upsertItem,
  deleteItem,
  getSession,
  setSession,
} from "./data";

function App() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(getSession());
  const [toastMsg, setToastMsg] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const navigate = useNavigate();

  // 처음에 로컬스토리지에서 글 불러오기
  useEffect(() => {
    setItems(readItems());
  }, []);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
  }, []);

  const handleHideToast = () => setToastMsg("");

  const handleAuthChange = (session) => {
    setUser(session);
  };

  const handleLogout = () => {
    setSession(null);
    setUser(null);
    showToast("로그아웃 되었습니다");
    navigate("/");
  };

  const handleAddItem = (item) => {
    const next = upsertItem(item);
    setItems(next);
    showToast("게시글이 저장되었습니다");
    navigate("/");
  };

  const handleUpdateItem = (item) => {
    const next = upsertItem(item);
    setItems(next);
  };

  const handleDeleteItem = (id) => {
    const next = deleteItem(id);
    setItems(next);
    showToast("삭제되었습니다");
  };

  const needLogin = () => {
    showToast("로그인이 필요합니다");
    setAuthMode("login");
    setAuthOpen(true);
  };

  const openLogin = () => {
    setAuthMode("login");
    setAuthOpen(true);
  };

  const openSignup = () => {
    setAuthMode("signup");
    setAuthOpen(true);
  };

  return (
    <>
      {/* 상단 공통 헤더 */}
      <Header
        user={user}
        onLoginOpen={openLogin}
        onSignupOpen={openSignup}
        onLogout={handleLogout}
      />

      {/* 페이지 라우팅 */}
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              items={items}
              user={user}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
            />
          }
        />
        <Route
          path="/register"
          element={
            <RegisterPage
              user={user}
              onNeedLogin={needLogin}
              onAddItem={handleAddItem}
            />
          }
        />
        <Route
          path="/report"
          element={
            <ReportPage
              user={user}
              onNeedLogin={needLogin}
              onAddItem={handleAddItem}
            />
          }
        />
        <Route
          path="/me"
          element={
            <MyPage
              user={user}
              items={items}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
            />
          }
        />
        <Route
          path="/admin"
          element={
            <AdminPage
              user={user}
              items={items}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
            />
          }
        />
      </Routes>

      {/* 토스트 알림 */}
      <Toast message={toastMsg} onHide={handleHideToast} />

      {/* 로그인/회원가입 모달 */}
      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onAuthChange={handleAuthChange}
        toast={showToast}
      />
    </>
  );
}

export default App;
