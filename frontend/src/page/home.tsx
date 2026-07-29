import "./homestyle.css";
import Popup from "./popup";
import { useState, useEffect } from "react";
import axios from "axios";
import { ProgressBar } from "../elements/progressbar";

const RANKING_TOP_POSITIONS = [512, 562, 613, 668, 723];

interface HomePros {
  showPopup: boolean;
  onClosePopup: () => void;
  onStartQuiz: () => void;
}

interface RankingItem {
  code: string;
  name: string;
  description: string;
  percentage: number;
  rank: number;
}

export default function Home({ showPopup, onClosePopup, onStartQuiz }: HomePros){
  const [ranking, setRanking] = useState<RankingItem[]>([])
  const [loading, setLoading] = useState(true);

  useEffect(() =>{
    const getRankingFromBackend = async () => {
      try {
        const respond = await axios.get("http://127.0.0.1:8000/quiz/ranking");
        setRanking(respond.data.ranking);
      } catch (error) {
        console.error("Lỗi kết nối lấy bảng xếp hạng", error);
      } finally {
        setLoading(false);
      }
    };
    getRankingFromBackend();
  }, [])


  if (loading) return <div style={{ padding: "50px", alignContent: "center" }}>Đang cập nhật bảng xếp hạng</div>;
  if (ranking.length === 0) return <div style={{ padding: "50px" }}>Không tìm thấy bảng xếp hạng nào!</div>;

  return (
    <div className="home-container">
      {showPopup && (
        <div className="popup-overlay">
          <Popup 
            onClose={onClosePopup} 
            onConfirm={() => {
              onClosePopup();
              onStartQuiz();  
            }} 
          />
        </div>
      )}
      <div className="homepage">
        {/* ── Header ── */}
        <header className="header">
          <button className="nav-frame nav-btn-social">
            <div className="nav-text nav-label-social">@cse-multimedia</div>
          </button>
          <button className="nav-logo">
            <img src="/image/cse-small.png" alt="CSE Multimedia" className="nav-logo-img" />
          </button>
          <button className="nav-frame nav-btn-hashtag">
            <div className="nav-text nav-label-hashtag">#BKTI</div>
          </button>
        </header>

        {/* ── Khối 1: Giới thiệu ── */}
        <div className="card-rect card-intro" />
        <div className="intro-heading-frame">
          <p className="intro-heading-text">BKTI là gì vậy nhỉ?</p>
        </div>
        <div className="intro-desc-frame">
          <p className="intro-desc-text">
            BKTI (Bach Khoa Type Indicator) là một bài trắc nghiệm tâm lý miễn phí ghép bạn vào 1 trong 10 hình mẫu “SV” Bách khoa dựa trên 3 chiều tâm lý. So với MBTI, nó hài hước và tốn ít thời gian hơn, còn so với SBTI từng làm mưa làm gió trên mạng xã hội thì nó là hàng Việt chất lượng cao. 18 câu, 3 phút, miễn phí, không cần đăng ký, chỉ cần bạn dành chút thời gian ghé thăm trang của chúng tôi.

          </p>
        </div>
        <div className="action-btn btn-opt1">
          <div className="btn-opt-label-1">Các kiểu tính cách</div>
        </div>
        <button className="action-btn btn-start" onClick={onStartQuiz}>
          <div className="btn-start-label">Bắt đầu làm bài</div>
        </button>
        <div className="action-btn btn-opt2">
          <div className="btn-opt-label-2">FAQ</div>
        </div>

        {/* ── Khối 2: Bảng xếp hạng (trái-trên) ── */}
        <div className="card-rect card-ranking" />
        <p className="block-title title-ranking">Bảng xếp hạng</p>
        {ranking.slice(0, 5).map((item, idx) => (
          <div className="group" style={{ top: `${RANKING_TOP_POSITIONS[idx]}px` }} key={item.code}>
            <div className="ranking-name">{item.name.replace(/\s*\([^)]*\)\s*/g, "").trim()}</div>
            <div className="ranking-light-text ranking-subtitle">{item.code}</div>
            <div className="ranking-light-text ranking-score">{item.percentage}%</div>
            <div className="ellipse" />
            <div className="ranking-progress">
              <ProgressBar current={item.percentage} total={100} showText = {false} />
            </div>
          </div>
        ))}

        {/* ── Khối 3: Trái-dưới ── */}
        <div className="card-rect card-lower-left" />
        <p className="block-title title-lower-left">Giới thiệu BTT</p>

        {/* ── Khối 4: Phải (dọc) ── */}
        <div className="card-rect card-right" />
        <p className="block-title title-right">Chủ nhân đằng sau BKTI</p>

        {/* ── Khối 5: Full-width 1 ── */}
        <div className="card-rect card-fullwidth-1" />
        <p className="block-title title-fullwidth-1">BKTI dùng để ABC, không phải để XYZ</p>

        {/* ── Khối 6: Full-width 2 ── */}
        <div className="card-rect card-fullwidth-2" />
        <p className="block-title title-fullwidth-2">Credit team BKTI</p>
      </div>
    </div>
  );
}


