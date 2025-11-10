// src/components/PostCard.jsx
import React from "react";
import { formatDate, placeholder, statusLabel } from "../data";

// ✅ 기본(default) export인 PostCard 컴포넌트
export default function PostCard({
  item,
  mine,
  onToggleStatus,
  onToggleHeart,
  onDelete,
  onEdit,
}) {
  const imgSrc = item.image || placeholder(item.species);

  return (
    <article className="card" role="listitem">
      <img className="thumb" alt="사진" src={imgSrc} />
      <div className="cardBody">
        <div className="badges">
          <span className={`badge cat-${item.category}`}>{item.category}</span>
          <span className="badge">{item.species}</span>
          <span className="badge">{item.sex}</span>
          {item.pinned && <span className="badge">📌고정</span>}
          <span className="badge">
            작성자:{item.authorName || "알수없음"}
          </span>
        </div>
        <h3 className="cardTitle">{item.title}</h3>
        <div className="meta">
          {item.location} · {formatDate(item.date)}
        </div>
        <p className="desc">{item.desc}</p>
      </div>
      <div className="cardFooter">
        <button
          className={`statusBtn ${item.status !== "open" ? "done" : ""}`}
          disabled={!mine}
          title={mine ? "상태 변경" : "작성자만 변경 가능"}
          onClick={() => mine && onToggleStatus(item)}
        >
          {statusLabel(item)}
        </button>
        <div className="actions">
          {mine && (
            <button className="iconBtn" onClick={() => onEdit && onEdit(item)}>
              수정
            </button>
          )}
          <button
            className={`iconBtn ${item.heart ? "active" : ""}`}
            onClick={() => onToggleHeart(item)}
          >
            ♥
          </button>
          {mine && (
            <button
              className="iconBtn"
              onClick={() => {
                if (window.confirm("정말 삭제할까요?")) onDelete(item);
              }}
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
