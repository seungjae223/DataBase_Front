// src/pages/AdminPage.jsx
import React, { useMemo, useState } from "react";
import { statusLabel, formatDate } from "../data";

function AdminPage({ user, items, onUpdateItem, onDeleteItem }) {
  // ---- 훅들은 항상 컴포넌트 맨 위에서 한 번씩만 호출 ----
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [status, setStatus] = useState("");

  const isAdmin = !!(user && user.isAdmin);

  const emptyStats = {
    total: 0,
    open: 0,
    byCat: { 실종: 0, 제보: 0, 입양: 0, 임보: 0 },
  };

  // 항상 호출되지만, 관리자 아닐 때는 비어 있는 값 리턴
  const stats = useMemo(() => {
    if (!isAdmin) return emptyStats;

    const total = items.length;
    const open = items.filter((x) => x.status === "open").length;
    const byCat = { 실종: 0, 제보: 0, 입양: 0, 임보: 0 };
    items.forEach((i) => {
      if (byCat[i.category] != null) byCat[i.category]++;
    });
    return { total, open, byCat };
  }, [items, isAdmin]);

  const rows = useMemo(() => {
    if (!isAdmin) return [];

    let list = items.slice();
    const k = q.trim().toLowerCase();
    if (k) {
      list = list.filter((x) =>
        (x.title + x.location + x.desc + x.authorName)
          .toLowerCase()
          .includes(k)
      );
    }
    if (cat) list = list.filter((x) => x.category === cat);
    if (status) list = list.filter((x) => x.status === status);
    list.sort(
      (a, b) =>
        (b.pinned ? -1 : 1) - (a.pinned ? -1 : 1) ||
        new Date(b.date) - new Date(a.date)
    );
    return list;
  }, [items, q, cat, status, isAdmin]);

  const togglePin = (item) => {
    onUpdateItem({ ...item, pinned: !item.pinned });
  };

  const changeCategory = (item, category) => {
    onUpdateItem({ ...item, category });
  };

  const changeStatus = (item, s) => {
    onUpdateItem({ ...item, status: s });
  };

  // ---- 여기서 조건부 렌더링만 ----
  if (!isAdmin) {
    return (
      <main className="section">
        <div className="wrap">
          <p>관리자만 접근할 수 있습니다.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <section className="hero">
        <div className="heroCard">
          <h1 className="heroTitle">관리자 페이지</h1>
          <p className="heroDesc">
            전체 게시글 현황과 카테고리, 상태를 한 번에 관리합니다.
          </p>
        </div>
      </section>

      <div className="wrap">
        <div className="kpiRow">
          <div className="kpi">
            <div className="label">총 게시글</div>
            <strong>{stats.total}</strong>
          </div>
          <div className="kpi">
            <div className="label">진행중</div>
            <strong>{stats.open}</strong>
          </div>
          <div className="kpi">
            <div className="label">실종</div>
            <strong>{stats.byCat.실종}</strong>
          </div>
          <div className="kpi">
            <div className="label">제보/입양/임보</div>
            <strong>
              {stats.byCat.제보 + stats.byCat.입양 + stats.byCat.임보}
            </strong>
          </div>
        </div>

        <div className="adminTools">
          <input
            className="input"
            placeholder="제목/위치/작성자 검색"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">전체 분류</option>
            <option>실종</option>
            <option>제보</option>
            <option>입양</option>
            <option>임보</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">전체 상태</option>
            <option value="open">진행중</option>
            <option value="done">완료</option>
          </select>
        </div>

        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>고정</th>
                <th>분류</th>
                <th>제목</th>
                <th>작성자</th>
                <th>상태</th>
                <th>등록일</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id}>
                  <td>
                    <button onClick={() => togglePin(item)}>
                      {item.pinned ? "📌" : "—"}
                    </button>
                  </td>
                  <td>
                    <select
                      value={item.category}
                      onChange={(e) => changeCategory(item, e.target.value)}
                    >
                      {["실종", "제보", "입양", "임보"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </td>
                  <td>{item.title}</td>
                  <td>{item.authorName}</td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(e) => changeStatus(item, e.target.value)}
                    >
                      <option value="open">진행중</option>
                      <option value="done">{statusLabel(item)}</option>
                    </select>
                  </td>
                  <td>{formatDate(item.date)}</td>
                  <td>
                    <button onClick={() => onDeleteItem(item.id)}>삭제</button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7}>조건에 맞는 글이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default AdminPage;
