// src/pages/MainPage.jsx
import React, { useMemo, useState } from "react";
import PostCard from "../components/PostCard";

function MainPage({ items, user, onUpdateItem, onDeleteItem }) {
  const [view, setView] = useState("cards");
  const [cat, setCat] = useState("실종");
  const [q, setQ] = useState("");
  const [species, setSpecies] = useState("");
  const [sex, setSex] = useState("");
  const [mineOnly, setMineOnly] = useState(false);

  const filtered = useMemo(() => {
    let rows = items.slice();
    if (cat !== "전체") rows = rows.filter((x) => x.category === cat);
    if (q.trim()) {
      const k = q.trim().toLowerCase();
      rows = rows.filter((x) =>
        (x.title + x.location + x.desc).toLowerCase().includes(k)
      );
    }
    if (species) rows = rows.filter((x) => x.species === species);
    if (sex) rows = rows.filter((x) => x.sex === sex);
    if (mineOnly && user) rows = rows.filter((x) => x.authorId === user.id);
    rows.sort(
      (a, b) =>
        (b.pinned ? -1 : 1) - (a.pinned ? -1 : 1) ||
        new Date(b.date) - new Date(a.date)
    );
    return rows;
  }, [items, cat, q, species, sex, mineOnly, user]);

  const counts = useMemo(() => {
    const base = { 실종: 0, 제보: 0, 입양: 0, 임보: 0 };
    items.forEach((i) => {
      if (base[i.category] != null) base[i.category]++;
    });
    return base;
  }, [items]);

  const handleToggleStatus = (item) => {
    if (!user || item.authorId !== user.id) return;
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
    if (!user || item.authorId !== user.id) return;
    onDeleteItem(item.id);
  };

  return (
    <main className="section active">
      <section className="hero">
        <div className="heroCard">
          <h1 className="heroTitle">메인: 전체 목록</h1>
          <p className="heroDesc">
            카테고리 탭을 눌러 실종/제보/입양/임보/전체를 전환하세요.
          </p>
          <div className="heroTools">
            <div className="inputWrap">
              <input
                className="input"
                placeholder="제목·위치·특징 검색…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <span className="searchIcon">⌕</span>
            </div>

            {/* ⬇⬇ 여기 두 개에 className="input" 추가 */}
            <select
              className="input"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
            >
              <option value="">전체 종</option>
              <option>고양이</option>
              <option>강아지</option>
              <option>기타</option>
            </select>
            <select
              className="input"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
            >
              <option value="">성별</option>
              <option>수컷</option>
              <option>암컷</option>
              <option>모름</option>
            </select>

            <button
              className="btn"
              onClick={() => {
                setQ("");
                setSpecies("");
                setSex("");
              }}
            >
              필터 초기화
            </button>
          </div>
        </div>
      </section>

      <nav className="tabs" aria-label="카테고리 탭">
        {["실종", "제보", "입양", "임보", "전체"].map((c) => (
          <button
            key={c}
            className={`tab ${cat === c ? "active" : ""}`}
            onClick={() => setCat(c)}
          >
            {c}
            {c !== "전체" && (
              <span className="count">{counts[c] || 0}</span>
            )}
            {c === "전체" && (
              <span className="count">
                {counts.실종 + counts.제보 + counts.입양 + counts.임보}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="wrap">
        <div className="toolsRow">
          <div className="left">
            <button
              className={`chip ${view === "cards" ? "active" : ""}`}
              onClick={() => setView("cards")}
            >
              카드
            </button>
            <button
              className={`chip ${view === "compact" ? "active" : ""}`}
              onClick={() => setView("compact")}
            >
              간단히
            </button>
            <button
              className={`chip ${mineOnly ? "active" : ""}`}
              onClick={() => setMineOnly((v) => !v)}
            >
              내 글만
            </button>
          </div>
          <div className="left">
            <span className="help">* 상태변경/삭제는 작성자만 가능</span>
          </div>
        </div>

        <div
          className={`grid ${view === "compact" ? "compact" : ""}`}
          role="list"
        >
          {filtered.length === 0 && (
            <div className="empty">조건에 맞는 글이 없습니다.</div>
          )}
          {filtered.map((item) => (
            <PostCard
              key={item.id}
              item={item}
              mine={user && user.id === item.authorId}
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

export default MainPage;
