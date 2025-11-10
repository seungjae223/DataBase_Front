// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ 이거 추가
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* ✅ Router 안에서 App을 렌더링해야 useNavigate 사용 가능 */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
