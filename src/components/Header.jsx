// src/components/Header.jsx
import React from "react";
import { NavLink } from "react-router-dom";

function Header({ user, onLoginOpen, onSignupOpen, onLogout }) {
  return (
    <header className="header">
      <div className="headerInner">
        <div className="logo">펫</div>
        <div className="title">실종·입양·임보 매칭</div>

        <nav className="nav" id="topNav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            메인
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            등록(보호자)
          </NavLink>
          <NavLink
            to="/report"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            제보(발견자)
          </NavLink>
          {user && (
            <NavLink
              to="/me"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              내 글
            </NavLink>
          )}
          {user?.isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              관리자
            </NavLink>
          )}
        </nav>

        <div className="headerActions">
          {user ? (
            <>
              <div className="userChip">
                <div className="userAvatar">
                  {(user.name || user.email || "U")[0].toUpperCase()}
                </div>
                <span>{user.name || user.email}</span>
                {user.isAdmin && <span className="badgeAdmin">관리자</span>}
              </div>
              <button className="btn" onClick={onLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button className="btn" onClick={() => onLoginOpen()}>
                로그인
              </button>
              <button className="btn" onClick={() => onSignupOpen()}>
                회원가입
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
