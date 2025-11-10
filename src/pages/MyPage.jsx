// src/pages/MyPage.jsx
import React from "react";
import PostCard from "../components/PostCard";

function MyPage({ user, items, onUpdateItem, onDeleteItem }) {
  if (!user) {
    return (
      <main className="section">
        <div className="wrap">
          <p>내 글 페이지는 로그인 후 이용 가능합니다.</p>
        </div>
      </main>
    );
  }

  const mine = items.filter((x) => x.authorId === user.id);

  const handleToggleStatus = (item) => {
    const next = {
      ...item,
      status: item.status === "open" ? "done" : "open",
    };
    onUpdateItem(next);
  };

  const handleToggleHeart = (item) => {
    const next = { ...item, heart: !item.heart };
    onUpdateItem(next);
  };

  const handleDelete = (item) => {
    if (window.confirm("정말 삭제할까요?")) onDeleteItem(item.id);
  };

  return (
    <main className="section">
      <section className="hero">
        <div className="heroCard">
          <h1 className="heroTitle">내 게시글 관리</h1>
          <p className="heroDesc">
            내가 올린 글을 한 번에 모아보고, 상태 변경/삭제를 할 수 있습니다.
          </p>
        </div>
      </section>
      <div className="wrap">
        {mine.length === 0 && <p>아직 작성한 글이 없습니다.</p>}
        <div className="grid" role="list">
          {mine.map((item) => (
            <PostCard
              key={item.id}
              item={item}
              mine={true}
              onToggleStatus={handleToggleStatus}
              onToggleHeart={handleToggleHeart}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default MyPage;
