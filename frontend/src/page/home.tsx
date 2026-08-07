import "./homestyle.css";
import Popup from "./popup";
import Pers_popup from "./personality_popup";
import FAQ from "./FAQ";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ProgressBar } from "../elements/progressbar";
import Footer from "../elements/footer";
import TiltCard from "../elements/tiltcard";
import Navbar from "../elements/navbar";
import API_URL from "../api";

// Luôn hiện 2 cái này dù chưa có ai ra
const SPECIAL_PERSONALITIES = [
  { code: "LMAO", name: "JZTR" },
  { code: "NSFW", name: "Nhà thám hiểm vĩ đại" },
];
const SPECIAL_CODES = SPECIAL_PERSONALITIES.map((p) => p.code);

const NORMAL_RANKING_TOPS = [508, 576, 644, 712, 780, 848, 916, 984];
const SPECIAL_RANKING_TOPS = [1078, 1146];

// Slide giới thiệu đoàn hội
const DH_SLIDES = [
  {
    id: 1,
    title: "Đoàn hội khoa Khoa học và Kỹ thuật Máy tính",
    content: (
      <>
        <img
          src="/image/Doan_hoi.jpg"
          alt="Doan hoi"
          className="dh-slide-img"
        />
      </>
    ),
  },
  {
    id: 2,
    title: "Ban Truyền thông khoa Khoa học\nvà Kỹ thuật Máy tính",
    content:
      "Thành lập từ năm 2015, Ban Truyền thông khoa Khoa học và Kỹ thuật Máy tính (gọi tắt là BTT) là bộ phận trực thuộc Đoàn Thanh niên - Liên Chi hội Sinh viên khoa (gọi tắt là Đoàn - Hội khoa). BTT chịu trách nhiệm sản xuất ấn phẩm truyền thông cho sự kiện của Đoàn - Hội khoa, cập nhật thông tin học vụ… cùng các thông tin khác, nâng cao đời sống tinh thần cho sinh viên khoa nói riêng và sinh viên trường nói chung. Với đội ngũ hơn 40 nhân sự, BTT được phân chia thành 4 phân ban - Content Creator, Media, Video Editor và Graphic Designer, đảm bảo quy trình truyền thông hiệu quả và chuyên nghiệp.",
  },
  {
    id: 3,
    title: "Ban Chấp hành khoa Khoa học\nvà Kỹ thuật Máy tính",
    content:
      'Đoàn Thanh niên - Liên Chi hội Sinh viên Khoa Khoa học và Kỹ thuật Máy tính là tổ chức chính trị - xã hội đóng vai trò nòng cốt trong việc rèn luyện phẩm chất, phát triển kỹ năng và đồng hành cùng sinh viên. Chúng tôi là cầu nối vững chắc giữa sinh viên với Ban Chủ nhiệm Khoa và các doanh nghiệp. Thông qua chuỗi sự kiện chuyên môn (CSE Job Fair, Company Tour, Code Tour,...) cùng các hoạt động phong trào theo tiêu chí "Sinh viên 5 tốt" (Mùa hè xanh, Xuân tình nguyện, CSE Olympics,...), Đoàn - Hội hướng tới xây dựng môi trường phát triển toàn diện cho sinh viên CSE.',
  },
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

export default function Home({
  showPopup,
  onClosePopup,
  onStartQuiz,
}: HomePros) {
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [infoPopupVisible, setInfoPopupVisible] = useState(false);

  const [persPopup, setPersPopup] = useState(false);
  const [faq, setFaq] = useState(false);

  // Slide đoàn hội
  const [DHSlideIndex, setDHSlideIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const [isDHAnimating, setIsDHAnimating] = useState(false); // animate trượt slide
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoplayTimerRef = useRef<any>(null);



  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setSlideDirection("next");
      setIsDHAnimating(true);
      setDHSlideIndex((prev) => (prev + 1) % DH_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  useEffect(() => {
    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, []);

  const resetAutoplayTimer = () => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
    }
    setIsAutoPlaying(false);
    autoplayTimerRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 5000);
  };

  const changeDHSlide = (nextIndex: number) => {
    setIsDHAnimating(true);
    setDHSlideIndex(nextIndex);
  };

  const handleNextDHSlide = () => {
    resetAutoplayTimer();
    const nextIndex = (DHSlideIndex + 1) % DH_SLIDES.length;
    changeDHSlide(nextIndex);
  };

  const handlePrevDHSlide = () => {
    resetAutoplayTimer();
    const nextIndex = (DHSlideIndex - 1 + DH_SLIDES.length) % DH_SLIDES.length;
    changeDHSlide(nextIndex);
  };

  const handleDHAnimationEnd = () => {
    setIsDHAnimating(false);
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

  useEffect(() => {
    const getRankingFromBackend = async () => {
      try {
        const respond = await axios.get(`${API_URL}/quiz/ranking`);
        setRanking(respond.data.ranking);
      } catch (error) {
        console.error("Lỗi kết nối lấy bảng xếp hạng", error);
      } finally {
        setLoading(false);
      }
    };
    getRankingFromBackend();
  }, []);

  useEffect(() => {
    const navTarget = localStorage.getItem("nav_target");
    if (navTarget) {
      localStorage.removeItem("nav_target");
      setTimeout(() => {
        handleNavClick(navTarget as any);
      }, 350);
    }
  }, []);

  if (loading)
    return (
      <div style={{ padding: "50px", alignContent: "center" }}>
        Đang cập nhật bảng xếp hạng
      </div>
    );

  const normalRank = ranking
    .filter((item) => !SPECIAL_CODES.includes(item.code))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 8);

  // Ghép với ranking API; chưa có data thì % = 0, vẫn hiện đủ 2 tính cách
  const specialRank = SPECIAL_PERSONALITIES.map((base) => {
    const found = ranking.find((item) => item.code === base.code);
    return {
      code: base.code,
      name: found?.name ?? base.name,
      description: found?.description ?? "",
      percentage: found?.percentage ?? 0,
      rank: found?.rank ?? 0,
    };
  }).sort((a, b) => b.percentage - a.percentage);

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
    setPersPopup(false);
  };

  // FAQ
  const isFaqOpen = faq;
  const handleCloseFaq = () => {
    onClosePopup();
    setFaq(false);
  };



  const handleNavClick = (target: 'home' | 'ranking' | 'personality' | 'faq' | 'credit') => {
    if (target === 'home') {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setInfoPopupVisible(true);
    } else if (target === 'ranking') {
      const el = document.querySelector('.ranking-board-container');
      if (el) {
        const offset = window.innerWidth <= 868 ? 60 : 72;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset - 16;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    } else if (target === 'personality') {
      setPersPopup(true);
    } else if (target === 'faq') {
      setFaq(true);
    } else if (target === 'credit') {
      const el = document.querySelector('.footer__container_01');
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
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
            <Pers_popup onClose={handleClosePers} />
          </div>
        </div>
      )}

      {isFaqOpen && (
        <div className="popup-overlay" onClick={handleCloseFaq}>
          <div onClick={(e) => e.stopPropagation()}>
            <FAQ onClose={handleCloseFaq} />
          </div>
        </div>
      )}

      <Navbar onNavClick={handleNavClick} />

      {/* ── Hero Section đặt ngoài để fill hết chiều ngang cửa sổ ── */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">“BKTI là gì vậy nhỉ?”</h1>
          <p className="hero-subtitle">
            BKTI là bài trắc nghiệm tâm lý miễn phí giúp khám phá bản thân qua các hình mẫu sinh viên Bách khoa.
            Chỉ mất 3 phút để có được một mô tả “đúng một cách đáng kinh ngạc” về con người bạn và lý do tại sao bạn lại làm mọi thứ theo cách của mình!
          </p>
          <button className="hero-start-btn" onClick={onStartQuiz}>
            Làm bài kiểm tra <span className="hero-arrow">→</span>
          </button>
        </div>
      </section>

      <div className="homepage">

        {/* ── Grid chứa phần nội dung bên dưới (Bảng xếp hạng & Đoàn hội) ── */}
        <div className="home-main-layout">
          <div className="home-left-column">
            {/* Khối 4: BKTI dùng để làm gì */}
            <TiltCard className="bkti-about-container">
              <h2 className="block-title title-right">BKTI dùng để làm gì</h2>
              <p className="right-block-text">
                BKTI là sản phẩm thuần giải trí. Chúng tôi hi vọng thông qua bài
                khảo sát này, các bạn sinh viên - đặc biệt là sinh viên năm nhất -
                sẽ có những phút giây giải trí và bắt đầu năm học mới một cách
                thật khoắn khỏe và năng lượng.<br></br>
                BKTI không được dùng cho các mục đích như xin việc hay thay thế
                các liệu pháp trị liệu tâm thần. Tuy nhiên, khảo sát với những
                người sử dụng BKTI phiên bản Beta cho thấy: 67,67% người tham gia
                sử dụng BKTI như một chủ đề để tán gẫu hay mở lời hẹn hò. Khi bạn
                nói "BKTI của tôi là JZTR" với nhà tuyển dụng, có thể họ sẽ không
                ấn tượng mấy, nhưng nếu nói với crush thì cô ấy/ anh ấy sẽ đổ bạn
                ngay lập tức, vì đó là 1 trong 2 kiểu tính cách ẩn của chúng tôi.
              </p>
            </TiltCard>

            {/* Khối 3: Slide Đoàn hội */}
            <TiltCard
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
                <button
                  className="dh-nav-btn"
                  onClick={handlePrevDHSlide}
                  aria-label="Previous slide"
                >
                  &#10094;
                </button>
                <span className="dh-slide-indicator">
                  {DHSlideIndex + 1} / {DH_SLIDES.length}
                </span>
                <button
                  className="dh-nav-btn"
                  onClick={handleNextDHSlide}
                  aria-label="Next slide"
                >
                  &#10095;
                </button>
              </div>
            </TiltCard>
          </div>

          <div className="home-right-column">
            {/* Khối 2: Bảng xếp hạng */}
            <TiltCard className="ranking-board-container">
              <h2 className="block-title title-ranking">Bảng xếp hạng cổ đông</h2>
              {ranking.length === 0 ? (
                <div className="ranking-card-normal">
                  <p className="ranking-section-title title-ranking-normal">
                    Nỏmie
                  </p>
                  <div className="ranking-list-container">
                    <div
                      className="group"
                      style={{
                        top: `${NORMAL_RANKING_TOPS[0]}px`,
                        width: "395px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <p className="ranking-empty-text">
                        Chưa có lượt xếp hạng nào hoặc không kết nối được server.
                        Hãy bắt đầu làm bài test đầu tiên!
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="ranking-card-normal">
                    <p className="ranking-section-title title-ranking-normal">
                      Nỏmie
                    </p>
                    <div className="ranking-list-container">
                      {normalRank.map((item, idx) => (
                        <div
                          className="group"
                          style={{ top: `${NORMAL_RANKING_TOPS[idx]}px` }}
                          key={item.code}
                        >
                          <div className={`ellipse rank-${idx + 1}`}>{idx + 1}</div>
                          <div className="ranking-name">Cổ đông {idx + 1}</div>
                          <div className="ranking-light-text ranking-subtitle">
                            {item.name.replace(/\s*\([^)]*\)\s*/g, "").trim()}
                          </div>
                          <div className="ranking-light-text ranking-score">
                            {item.percentage}%
                          </div>
                          <div className="ranking-progress">
                            <ProgressBar
                              current={item.percentage}
                              total={100}
                              showText={false}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {specialRank.length > 0 && (
                    <div className="ranking-card-special">
                      <p className="ranking-section-title title-ranking-special">
                        Sít rịt
                      </p>
                      <div className="ranking-list-container">
                        {specialRank.map((item, idx) => (
                          <div
                            className="group"
                            style={{ top: `${SPECIAL_RANKING_TOPS[idx]}px` }}
                            key={item.code}
                          >
                            <div className={`ellipse rank-${idx + 1}`}>
                              {idx + 1}
                            </div>
                            <div className="special-ranking-name">
                              bủ bủ lmao {idx + 1}
                            </div>
                            <div className="ranking-light-text ranking-score">
                              {item.percentage}%
                            </div>
                            <div className="ranking-progress">
                              <ProgressBar
                                current={item.percentage}
                                total={100}
                                showText={false}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </TiltCard>
          </div>
        </div>

        {/* Khối 5: Đăng ký BTT */}
        <TiltCard className="bkti-register-container">
          <h2 className="block-title title-fullwidth-1">
            Đăng ký để trở thành thành viên BCH và BTT ngay hôm nay!
          </h2>
          <p className="fullwidth-block-text">
            Ban Chấp hành (BCH) và Ban Truyền thông (BTT) khoa Khoa học và Kỹ
            thuật Máy tính luôn chào đón các thế hệ sinh viên nhiệt huyết, đam
            mê sáng tạo và mong muốn thử thách bản thân trong môi trường
            truyền thông năng động. Đăng ký tham gia BCH và BTT ngay hôm nay
            để có cơ hội được học hỏi, rèn luyện các kỹ năng thiết kế, viết
            lách, quay dựng phim và tổ chức các sự kiện lớn nhỏ của Khoa và
            Trường!
          </p>
          <div className="btt-reg-links">
            <a
              href="https://forms.gle/iWrVv1UbmcPQZ1sz5"
              className="btt-reg-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mấy cổ đông click vào đây để đăng kí vào BTT nhen!
            </a>
            <a
              href="https://www.facebook.com/BKCSE.Multimedia"
              className="btt-reg-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Còn đăng ký vào BCH thì ở đây!
            </a>
          </div>
        </TiltCard>
      </div>
      <Footer />
    </div>
  );
}