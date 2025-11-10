// src/data.js

// 키값
const LS_ITEMS = "petapp_items_v1";
const LS_USERS = "petapp_users_v1";
const LS_SESSION = "petapp_session_v1";

export function placeholder(label = "PET") {
  const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
  <defs><linearGradient id='g' x1='0' x2='0' y1='0' y2='1'>
    <stop offset='0%' stop-color='#e6f5fb'/><stop offset='100%' stop-color='#ffffff'/>
  </linearGradient></defs>
  <rect width='100%' height='100%' fill='url(#g)'/>
  <g fill='#47b0d8' font-family='sans-serif' font-weight='800'>
    <text x='50%' y='48%' font-size='56' text-anchor='middle'>${label}</text>
    <text x='50%' y='58%' font-size='18' text-anchor='middle' fill='#667085'>이미지 미등록</text>
  </g>
</svg>`);
  return `data:image/svg+xml;charset=utf-8,${svg}`;
}

// seed 데이터
export function seedItems() {
  return [
    {
      id: crypto.randomUUID(),
      category: "실종",
      title: "○○동 고등어태비 실종",
      species: "고양이",
      sex: "모름",
      color: "고등어태비",
      age: "2살 추정",
      location: "서산 ○○동 ○○아파트 단지",
      desc: "목줄 X, 사람을 잘 피함. 밤 9시경 실종",
      date: new Date().toISOString(),
      image: placeholder("고양이"),
      status: "open",
      heart: false,
      pinned: false,
      authorId: "system",
      authorName: "시스템",
    },
    {
      id: crypto.randomUUID(),
      category: "제보",
      title: "체고 근처 흰색 소형견 목격",
      species: "강아지",
      sex: "모름",
      color: "흰색",
      age: "미상",
      location: "학교 정문 횡단보도",
      desc: "하네스 없음, 겁이 많음. 오전 8:30경",
      date: new Date().toISOString(),
      image: placeholder("강아지"),
      status: "open",
      heart: true,
      pinned: false,
      authorId: "system",
      authorName: "시스템",
    },
    {
      id: crypto.randomUUID(),
      category: "입양",
      title: "샴믹스 구조묘 입양처 찾아요",
      species: "고양이",
      sex: "암컷",
      color: "크림/브라운",
      age: "1살",
      location: "서산 보호소 임시보호중",
      desc: "중성화 완료, 기본검진 완료",
      date: new Date().toISOString(),
      image: placeholder("입양"),
      status: "open",
      heart: false,
      pinned: false,
      authorId: "system",
      authorName: "시스템",
    },
  ];
}

// ===== 아이템 =====
export function readItems() {
  try {
    const raw = localStorage.getItem(LS_ITEMS);
    if (!raw) {
      const s = seedItems();
      localStorage.setItem(LS_ITEMS, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw);
  } catch {
    const s = seedItems();
    localStorage.setItem(LS_ITEMS, JSON.stringify(s));
    return s;
  }
}

export function writeItems(items) {
  localStorage.setItem(LS_ITEMS, JSON.stringify(items));
}

export function upsertItem(item) {
  const list = readItems();
  const idx = list.findIndex((i) => i.id === item.id);
  if (idx >= 0) list[idx] = item;
  else list.unshift(item);
  writeItems(list);
  return list;
}

export function deleteItem(id) {
  const list = readItems().filter((i) => i.id !== id);
  writeItems(list);
  return list;
}

// ===== 유저 / 세션 =====
export function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(LS_USERS) || "[]");
  } catch {
    return [];
  }
}

export function writeUsers(users) {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(LS_SESSION) || "null");
  } catch {
    return null;
  }
}

export function setSession(session) {
  if (session) {
    localStorage.setItem(LS_SESSION, JSON.stringify(session));
  } else {
    localStorage.removeItem(LS_SESSION);
  }
}

export function hashPassword(pw) {
  return btoa(unescape(encodeURIComponent("v1::" + pw)));
}

export function formatDate(d) {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  const hh = String(dt.getHours()).padStart(2, "0");
  const mm = String(dt.getMinutes()).padStart(2, "0");
  return `${y}.${m}.${day} ${hh}:${mm}`;
}

export function statusLabel(item) {
  if (item.status === "done") {
    if (item.category === "실종") return "발견/귀가";
    if (item.category === "제보") return "처리완료";
    if (item.category === "입양") return "입양완료";
    if (item.category === "임보") return "임보종료";
    return "완료";
  }
  return "진행중";
}
