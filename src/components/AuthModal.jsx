// src/components/AuthModal.jsx
import React, { useState } from "react";
import {
  readUsers,
  writeUsers,
  hashPassword,
  setSession,
  getSession,
} from "../data";

function AuthModal({ open, mode, onClose, onAuthChange, toast }) {
  const [authMode, setAuthMode] = useState(mode || "login");

  const [suName, setSuName] = useState("");
  const [suNick, setSuNick] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPass, setSuPass] = useState("");
  const [suPass2, setSuPass2] = useState("");

  const [liEmail, setLiEmail] = useState("");
  const [liPass, setLiPass] = useState("");

  React.useEffect(() => {
    if (mode) setAuthMode(mode);
  }, [mode]);

  if (!open) return null;

  const handleSignup = (e) => {
    e.preventDefault();
    const name = suName.trim();
    const email = suEmail.trim().toLowerCase();
    const pass = suPass;
    const pass2 = suPass2;
    if (pass.length < 6) {
      alert("비밀번호는 최소 6자");
      return;
    }
    if (pass !== pass2) {
      alert("비밀번호가 일치하지 않습니다");
      return;
    }
    const users = readUsers();
    if (users.some((u) => u.email === email)) {
      alert("이미 가입된 이메일");
      return;
    }
    const isFirst = users.length === 0;
    const user = {
      id: crypto.randomUUID(),
      name,
      nick: suNick.trim(),
      email,
      pass: hashPassword(pass),
      isAdmin: isFirst || email.endsWith("@admin.local"),
    };
    users.push(user);
    writeUsers(users);
    setSession({
      id: user.id,
      name: user.name || user.nick,
      email: user.email,
      isAdmin: user.isAdmin,
    });
    const session = getSession();
    onAuthChange(session);
    onClose();
    toast(
      user.isAdmin ? "관리자 계정으로 가입되었습니다" : "회원가입 완료!"
    );
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const email = liEmail.trim().toLowerCase();
    const pass = liPass;
    const users = readUsers();
    const u = users.find(
      (x) => x.email === email && x.pass === hashPassword(pass)
    );
    if (!u) {
      alert("이메일 또는 비밀번호가 올바르지 않습니다");
      return;
    }
    setSession({
      id: u.id,
      name: u.name || u.nick,
      email: u.email,
      isAdmin: u.isAdmin,
    });
    onAuthChange(getSession());
    onClose();
    toast("로그인 되었습니다");
  };

  const closeOnBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="authScrim"
      role="dialog"
      aria-modal="true"
      onClick={closeOnBackdrop}
    >
      <div className="authCard">
        <div className="authHeader">
          <strong>접속</strong>
          <button className="btn" onClick={onClose}>
            닫기
          </button>
        </div>
        <div className="authBody">
          <div className="authTabs">
            <button
              className={`authTab ${authMode === "login" ? "active" : ""}`}
              onClick={() => setAuthMode("login")}
            >
              로그인
            </button>
            <button
              className={`authTab ${authMode === "signup" ? "active" : ""}`}
              onClick={() => setAuthMode("signup")}
            >
              회원가입
            </button>
          </div>

          {authMode === "signup" ? (
            <form className="authForm" onSubmit={handleSignup}>
              <label>
                이름
                <input
                  className="input"
                  value={suName}
                  onChange={(e) => setSuName(e.target.value)}
                />
              </label>
              <label>
                닉네임
                <input
                  className="input"
                  value={suNick}
                  onChange={(e) => setSuNick(e.target.value)}
                />
              </label>
              <label>
                이메일
                <input
                  className="input"
                  type="email"
                  value={suEmail}
                  onChange={(e) => setSuEmail(e.target.value)}
                />
              </label>
              <label>
                비밀번호
                <input
                  className="input"
                  type="password"
                  value={suPass}
                  onChange={(e) => setSuPass(e.target.value)}
                />
              </label>
              <label>
                비밀번호 확인
                <input
                  className="input"
                  type="password"
                  value={suPass2}
                  onChange={(e) => setSuPass2(e.target.value)}
                />
              </label>
              <button className="btn primary" type="submit">
                회원가입
              </button>
            </form>
          ) : (
            <form className="authForm" onSubmit={handleLogin}>
              <label>
                이메일
                <input
                  className="input"
                  type="email"
                  value={liEmail}
                  onChange={(e) => setLiEmail(e.target.value)}
                />
              </label>
              <label>
                비밀번호
                <input
                  className="input"
                  type="password"
                  value={liPass}
                  onChange={(e) => setLiPass(e.target.value)}
                />
              </label>
              <button className="btn primary" type="submit">
                로그인
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
