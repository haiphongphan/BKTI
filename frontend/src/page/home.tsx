import "./homestyle.css";
import Popup from "./popup";
import Pers_popup from "./personality_popup"
import FAQ from "./FAQ"
import { useState, useEffect } from "react";
import axios from "axios";
import { ProgressBar } from "../elements/progressbar";
import Footer from "../elements/footer";

const RANKING_TOP_POSITIONS = [512, 562, 613, 668, 723];

// Slide giới thiệu đoàn hội
const DH_SLIDES = [
  {
    id: 1,
    title: "Đoàn hội khoa Khoa học và Kỹ thuật Máy tính",
    content: (
      <>
      <img src="/image/doan_hoi.jpg" alt="Doan hoi" className="dh-slide-img" />
      </>
    )
  },
  {
    id: 2,
    title: "Ban Truyền thông khoa Khoa học\nvà Kỹ thuật Máy tính",
    content: "Thành lập từ năm 2015, Ban Truyền thông khoa Khoa học và Kỹ thuật Máy tính (gọi tắt là BTT) là bộ phận trực thuộc Đoàn Thanh niên - Liên Chi hội Sinh viên khoa (gọi tắt là Đoàn - Hội khoa). BTT chịu trách nhiệm sản xuất ấn phẩm truyền thông cho sự kiện của Đoàn - Hội khoa, cập nhật thông tin học vụ… cùng các thông tin khác, nâng cao đời sống tinh thần cho sinh viên khoa nói riêng và sinh viên trường nói chung. Với đội ngũ hơn 40 nhân sự, BTT được phân chia thành 4 phân ban - Content Creator, Media, Video Editor và Graphic Designer, đảm bảo quy trình truyền thông hiệu quả và chuyên nghiệp."
  },
  {
    id: 3,
    title: "Ban Chấp hành khoa Khoa học\nvà Kỹ thuật Máy tính",
    content: "abcxyz"
  }
];

const CREDIT_MEMBERS = [
  {
    id: 1,
    name: "Đinh Quốc Thịnh",
    role: "",
    quote: "",
    avatar: "/image/credit_members/"
  },
  {
    id: 2,
    name: "Phan Hải Phong",
    role: "Lead Dev",
    quote: "\"Sống nay chết mai\"",
    avatar: "/image/credit_members/PHP.jpeg"
  },
  {
    id: 3,
    name: "Lâm Chí Nguyên",
    role: "",
    quote: "",
    avatar: "/image/credit_members/"
  },
  {
    id: 4,
    name: "Trần Duy Phước Nghĩa",
    role: "",
    quote: "",
    avatar: "/image/credit_members/"
  },
  {
    id: 5,
    name: "Nguyễn Huy Nhật",
    role: "",
    quote: "",
    avatar: "/image/credit_members/"
  },
  {
    id: 6,
    name: "Hàng Khang Định",
    role: "",
    quote: "",
    avatar: "/image/credit_members/"
  },
  {
    id: 7,
    name: "Nguyễn Thị Hồng Ngọc",
    role: "",
    quote: "",
    avatar: "/image/credit_members/"
  },
  {
    id: 8,
    name: "Lê Nguyên Hào",
    role: "",
    quote: "",
    avatar: "/image/credit_members/"
  },
  {
    id: 9,
    name: "Văn Huỳnh Như",
    role: "",
    quote: "",
    avatar: "/image/credit_members/"
  }
];



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
  const [infoPopupVisible, setInfoPopupVisible] = useState(false);

  const [persPopup, setPersPopup] = useState(false);
  const [faq, setFaq] = useState(false);

  // Slide đoàn hội
  const [DHSlideIndex, setDHSlideIndex] = useState(0);
  const [isDHAnimating, setisDHAnimating] = useState(false); // animate trượt slide
  
  const changeDHSlide = (nextIndex: number) => {
    setisDHAnimating(true);
    setDHSlideIndex(nextIndex);
  };

  const handleNextDHSlide = () => {
    const nextIndex = (DHSlideIndex + 1) % DH_SLIDES.length;
    changeDHSlide(nextIndex);
  };

  const handlePrevDHSlide = () => {
    const nextIndex = (DHSlideIndex - 1 + DH_SLIDES.length) % DH_SLIDES.length;
    changeDHSlide(nextIndex);
  };

  const handleDHAnimationEnd = () => {
    setisDHAnimating(false);
  };

  // Vuốt slide trên mobile
  const [touchPosition, setTouchPosition] = useState<number | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    const touchDown = e.touches[0].clientX;
    setTouchPosition(touchDown);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchDown = touchPosition;
    if (touchDown === null) return;

    const currentTouch = e.touches[0].clientX;
    const diff = touchDown - currentTouch;

    // Vuốt sang trái (next slide)
    if (diff > 50) {
      handleNextDHSlide();
      setTouchPosition(null);
    }

    // Vuốt sang phải (prev slide)
    if (diff < -50) {
      handlePrevDHSlide();
      setTouchPosition(null);
    }
  };

  // Credit
  const [creditIndex, setCreditIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const [isCreditAnimating, setIsCreditAnimating] = useState(false);

  const handleNextCredit = () => {
    setSlideDirection("next");
    setIsCreditAnimating(true);
    setCreditIndex((prev) => (prev + 1) % CREDIT_MEMBERS.length);
  };

  const handlePrevCredit = () => {
    setSlideDirection("prev");
    setIsCreditAnimating(true);
    setCreditIndex((prev) => (prev - 1 + CREDIT_MEMBERS.length) % CREDIT_MEMBERS.length);
  };

  const handleCreditAnimationEnd = () => {
    setIsCreditAnimating(false);
  };




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
  // Cũ:
  // if (ranking.length === 0) return <div style={{ padding: "50px" }}>Không tìm thấy bảng xếp hạng nào!</div>;



  // Bật popup từ nút hoặc tự động khi mở web
  const isPopupOpen = showPopup || infoPopupVisible;
  const handleClose = () => {
    onClosePopup();
    setInfoPopupVisible(false);
  };

  // Các kiểu tính cách
  const isPersPopupOpen = persPopup;
  const handleClosePers = () => {
    onClosePopup();
    setPersPopup(false)
  };

  // FAQ
  const isFaqOpen = faq;
  const handleCloseFaq = () => {
    onClosePopup();
    setFaq(false)
  };

  return (
    <div className="home-container">
      {isPopupOpen && (
        <div className="popup-overlay" onClick={handleClose}>
          <div onClick={(e) => e.stopPropagation()}>
            <Popup 
              onClose={handleClose} 
              onConfirm={() => {
                handleClose();
                onStartQuiz();  
              }} 
            />
          </div>
        </div>
      )}

      {isPersPopupOpen && (
        <div className="popup-overlay" onClick={handleClosePers}>
          <div onClick={(e) => e.stopPropagation()}>
            <Pers_popup
              onClose={handleClosePers}
            />
          </div>
        </div>
      )}

      {isFaqOpen && (
        <div className="popup-overlay" onClick={handleCloseFaq}>
          <div onClick={(e) => e.stopPropagation()}>
            <FAQ
              onClose={handleCloseFaq}
            />
          </div>
        </div>
      )}

      <div className="homepage">
        {/* ── Header ── */}
        <header className="header">
          <button className="nav-frame nav-btn-social" onClick={() => setInfoPopupVisible(true)}>
            <div className="nav-text nav-label-social">@cse-multimedia</div>
          </button>
          <button className="nav-logo" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
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
        <div className="action-btn btn-opt1" onClick={() => setPersPopup(true)}>
          <div className="btn-opt-label-1">Các kiểu tính cách</div>
        </div>
        <button className="action-btn btn-start" onClick={onStartQuiz}>
          <div className="btn-start-label">Bắt đầu làm bài</div>
        </button>
        <div className="action-btn btn-opt2" onClick={() => setFaq(true)}>
          <div className="btn-opt-label-2">FAQ</div>
        </div>

        {/* ── Khối 2: Bảng xếp hạng (trái-trên) ── */}
        <div className="card-rect card-ranking" />
        <p className="block-title title-ranking">Bảng xếp hạng</p>
        {ranking.length === 0 ? (
          <div className="group" style={{ top: `${RANKING_TOP_POSITIONS[0]}px`, width: "395px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "#777", fontSize: "14px", fontStyle: "italic", textAlign: "center", width: "100%", margin: "10px 0", lineHeight: "1.4" }}>
              Chưa có lượt xếp hạng nào hoặc không kết nối được server. Hãy bắt đầu làm bài test đầu tiên!
            </p>
          </div>
        ) : (
          ranking.slice(0, 5).map((item, idx) => (
            <div className="group" style={{ top: `${RANKING_TOP_POSITIONS[idx]}px` }} key={item.code}>
              <div className="ranking-name">{item.name.replace(/\s*\([^)]*\)\s*/g, "").trim()}</div>
              <div className="ranking-light-text ranking-subtitle">{item.code}</div>
              <div className="ranking-light-text ranking-score">{item.percentage}%</div>
              <div className="ellipse" />
              <div className="ranking-progress">
                <ProgressBar current={item.percentage} total={100} showText = {false} />
              </div>
            </div>
          ))
        )}

        {/* ── Khối 3: Trái-dưới ── */}
        <div className="card-rect card-lower-left" />
        <div 
          className="dh-slide-wrapper"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div 
            className={`btt-slide-inner ${isDHAnimating ? "slide-fade-in" : ""}`}
            onAnimationEnd={handleDHAnimationEnd}
          >
            <p className="block-title dh-slide-title">
              {DH_SLIDES[DHSlideIndex].title}
            </p>
            <div className="dh-slide-body">
              <p className="dh-slide-content">
                {DH_SLIDES[DHSlideIndex].content}
              </p>
            </div>
          </div>
          
          {/* Thanh điều hướng slide */}
          <div className="dh-slide-controls">
            <button className="dh-nav-btn" onClick={handlePrevDHSlide} aria-label="Previous slide">
              &#10094;
            </button>
            <span className="dh-slide-indicator">
              {DHSlideIndex + 1} / {DH_SLIDES.length}
            </span>
            <button className="dh-nav-btn" onClick={handleNextDHSlide} aria-label="Next slide">
              &#10095;
            </button>
          </div>
        </div>

        {/* ── Khối 4: Phải (dọc) ── */}
        <div className="card-rect card-right" />
        <p className="block-title title-right">Chủ nhân đằng sau BKTI</p>

        {/* ── Khối 5: Full-width 1 ── */}
        <div className="card-rect card-fullwidth-1" />
        <p className="block-title title-fullwidth-1">BKTI dùng để ABC, không phải để XYZ</p>

        {/* ── Khối 6: Full-width 2 ── */}
        <div className="card-rect card-fullwidth-2" />
        <div className="credit-container">
          {/* Cột trái: Thông tin chung của trang web */}
          <div className="credit-info-general">
            <h3 className="block-title credit-title">Credit team BKTI</h3>
            <p className="credit-general-desc">
              BKTI - bao gồm nội dung trang web, thiết kế và các hình ảnh minh họa - là sản phẩm thuộc quyền sở hữu của 9 nhân vật phản diện thuộc BTT - khả ái và ngây ngất lòng người.

            </p>
          </div>

          {/* Cột phải: Card slide thành viên */}
          <div className="credit-member-slide-wrapper">
            {/* Nút mũi tên TRÁI */}
            <button className="credit-nav-btn credit-nav-left" onClick={handlePrevCredit} aria-label="Previous member">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {/* Khung nội dung hiển thị ở giữa */}
            <div className="credit-member-slide">
              <div 
                className={`member-card-content ${
                  isCreditAnimating 
                    ? slideDirection === "next" 
                      ? "slide-from-right" 
                      : "slide-from-left" 
                    : ""
                }`}
                onAnimationEnd={handleCreditAnimationEnd}
              >
                {/* 1. Tên thành viên phía trên */}
                <h4 className="member-name">{CREDIT_MEMBERS[creditIndex].name}</h4>
                <p className="member-role">{CREDIT_MEMBERS[creditIndex].role}</p>
                <p className="member-quote">{CREDIT_MEMBERS[creditIndex].quote}</p>

                {/* 2. Avatar phía dưới */}
                <div className="member-avatar-wrapper-23">
                  <img 
                    src={CREDIT_MEMBERS[creditIndex].avatar} 
                    alt={CREDIT_MEMBERS[creditIndex].name} 
                    className="member-avatar-23"
                  />
                </div>
              </div>

              {/* Chỉ số trang hiển thị góc dưới */}
              <div className="credit-page-indicator">
                {creditIndex + 1} / {CREDIT_MEMBERS.length}
              </div>
            </div>

            {/* Nút mũi tên PHẢI */}
            <button className="credit-nav-btn credit-nav-right" onClick={handleNextCredit} aria-label="Next member">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
        
      </div>
      <Footer/>
    </div>
  );
}


