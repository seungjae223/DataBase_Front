// src/components/Toast.jsx
import React, { useEffect } from "react";

function Toast({ message, onHide }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onHide, 1500);
    return () => clearTimeout(t);
  }, [message, onHide]);

  return (
    <div className={`toast ${message ? "show" : ""}`} aria-live="polite">
      {message}
    </div>
  );
}

export default Toast;
