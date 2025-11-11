// src/pages/ReportPage.jsx
import React, { useEffect, useRef, useState } from "react";
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

  const mapRef = useRef(null);      // 지도 DOM
  const kakaoMap = useRef(null);    // 지도 인스턴스
  const markerRef = useRef(null);   // 마커 인스턴스

  // 파일 업로드
  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const fr = new FileReader();
    fr.onload = () => setImageData(fr.result.toString());
    fr.readAsDataURL(f);
  };

  // ✅ Kakao SDK 로딩 → 지도 초기화
  useEffect(() => {
    if (!mapRef.current) return;

    function initKakaoMap() {
      const { kakao } = window;
      kakao.maps.load(() => {
        const center = new kakao.maps.LatLng(36.781, 126.452); // 서산 근처
        const map = new kakao.maps.Map(mapRef.current, { center, level: 5 });
        kakaoMap.current = map;

        const marker = new kakao.maps.Marker({ position: center });
        marker.setMap(map);
        markerRef.current = marker;
      });
    }

    if (window.kakao && window.kakao.maps) {
      initKakaoMap();
    } else {
      const script = document.getElementById("kakao-sdk");
      if (script && !script.dataset.loaded) {
        script.addEventListener("load", () => {
          script.dataset.loaded = "true";
          initKakaoMap();
        });
      } else if (script && script.dataset.loaded === "true") {
        initKakaoMap();
      } else {
        const retry = setInterval(() => {
          if (window.kakao && window.kakao.maps) {
            clearInterval(retry);
            initKakaoMap();
          }
        }, 300);
      }
    }
  }, []);

  // 주소로 지도 이동
  const updateMapByAddress = () => {
    if (!window.kakao || !window.kakao.maps) {
      alert("지도를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
    if (!location.trim()) return;

    const { kakao } = window;
    if (!kakao.maps.services) {
      alert("지도 검색 서비스 로딩 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(location.trim(), (result, status) => {
      if (status !== kakao.maps.services.Status.OK) {
        alert("주소를 찾지 못했어요. 조금 더 자세히 입력해 주세요.");
        return;
      }
      const coord = new kakao.maps.LatLng(result[0].y, result[0].x);
      if (!kakaoMap.current || !markerRef.current) return;

      kakaoMap.current.setCenter(coord);
      markerRef.current.setPosition(coord);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      onNeedLogin();
      return;
    }
    if (!title.trim() || !location.trim()) {
      alert("제목/목격 위치를 입력하세요");
      return;
    }

    const newItem = {
      id: crypto.randomUUID(),
      category: "제보",                   // ✅ 제보 고정
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

    // 폼 초기화
    setTitle("");
    setSpecies("강아지");
    setSex("모름");
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

      {/* 왼쪽 폼 + 오른쪽 지도 */}
      <div className="formLayout">
        <form className="form formMain" onSubmit={handleSubmit}>
          <div className="row">
            <label>제목</label>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 학교 정문 근처 흰색 소형견"
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
                <option>강아지</option>
                <option>고양이</option>
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
              placeholder="예: 학교 정문 앞 횡단보도"
            />
            <button
              type="button"
              className="btn"
              style={{ marginTop: 6 }}
              onClick={updateMapByAddress}
            >
              지도에서 보기
            </button>
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

        <aside className="formSide">
          <div className="mapBox" ref={mapRef} />
          <p className="mapHelp">
            목격 위치를 입력하고 “지도에서 보기”를 누르면 지도가 이동합니다.
          </p>
        </aside>
      </div>
    </main>
  );
}

export default ReportPage;
