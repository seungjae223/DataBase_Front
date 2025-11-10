// src/pages/ReportPage.jsx
import React, { useState } from "react";
import { placeholder } from "../data";

function ReportPage({ user, onNeedLogin, onAddItem }) {
  const [title, setTitle] = useState("");
  const [species, setSpecies] = useState("강아지");
  const [sex, setSex] = useState("모름");
  const [color, setColor] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [desc, setDesc] = useState("");
  const [imageData, setImageData] = useState("");

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const fr = new FileReader();
    fr.onload = () => {
      setImageData(fr.result.toString());
    };
    fr.readAsDataURL(f);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      onNeedLogin();
      return;
    }
    if (!title.trim() || !location.trim()) {
      alert("제목/위치를 입력하세요");
      return;
    }
    const newItem = {
      id: crypto.randomUUID(),
      category: "제보",
      title: title.trim(),
      species,
      sex,
      color: color.trim(),
      age: age.trim(),
      location: location.trim(),
      desc: desc.trim(),
      date: new Date().toISOString(),
      image: imageData || placeholder("제보"),
      status: "open",
      heart: false,
      pinned: false,
      authorId: user.id,
      authorName: user.name || user.email,
    };
    onAddItem(newItem);
    setTitle("");
    setColor("");
    setAge("");
    setLocation("");
    setDesc("");
    setImageData("");
  };

  return (
    <main className="section">
      <section className="hero">
        <div className="heroCard">
          <h1 className="heroTitle">제보 페이지 — 발견자용</h1>
          <p className="heroDesc">
            길에서 본 동물 정보를 제보합니다. (로그인 필요, 분류는 “제보”)
          </p>
        </div>
      </section>

      <div className="wrap">
        <form className="form" onSubmit={handleSubmit}>
          <div className="row">
            <label>제목</label>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 학교 정문 근처 흰색 소형견 목격"
            />
          </div>
          <div className="row two">
            <div>
              <label>종</label>
              <select
                className="input"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
              >
                <option>고양이</option>
                <option>강아지</option>
                <option>기타</option>
              </select>
            </div>
            <div>
              <label>성별</label>
              <select
                className="input"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
              >
                <option>수컷</option>
                <option>암컷</option>
                <option>모름</option>
              </select>
            </div>
          </div>
          <div className="row two">
            <div>
              <label>색/무늬</label>
              <input
                className="input"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <div>
              <label>추정 나이</label>
              <input
                className="input"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <label>목격 위치</label>
            <input
              className="input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="row">
            <label>상세 내용</label>
            <textarea
              className="input"
              rows={4}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div className="row">
            <label>사진</label>
            <input className="input" type="file" onChange={handleFile} />
            {imageData && (
              <div className="preview">
                <img src={imageData} alt="미리보기" />
              </div>
            )}
          </div>

          <div className="row">
            <button className="btn primary" type="submit">
              제보 등록
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default ReportPage;
