import React, { useState, useEffect, useRef } from 'react';
import './footerstyle.css';
import FB from "/image/facebook.svg";
import TT from "/image/tiktok.svg";
import Mail from "/image/mail.svg";
import Ins from "/image/ins.svg";
import Git from "/image/github.svg";

const CREDIT_MEMBERS = [
  {
    id: 1,
    name: "Đinh Quốc Thịnh",
    role: "Lead Content",
    quote: "\"Ước gì một ngày có 36 tiếng để có thể ngủ 12 tiếng.\"",
    avatar: "/image/credit_members/DQT.jpg",
    socials: {
      instagram: "https://www.instagram.com/biinseventeen"
    }
  },
  {
    id: 2,
    name: "Phan Hải Phong",
    role: "Lead Dev",
    quote: "\"Họ cười tôi vì tôi không giống họ, tôi cười họ vì tưởng họ cười với tôi 🤡\"",
    avatar: "/image/credit_members/PHP.jpg",
    socials: {
      facebook: "https://www.facebook.com/phongphanhai06",
      instagram: "https://www.instagram.com/phongphanhai06",
      email: "mailto:phong.phan06@hcmut.edu.vn",
      github: "https://github.com/haiphongphan"
    }
  },
  {
    id: 3,
    name: "Lâm Chí Nguyên",
    role: "Dev Team",
    quote: "\" \"",
    avatar: "/image/credit_members/PHP.jpeg",
    socials: {
      tiktok: "tiktok.com/...",
    }
  },
  {
    id: 4,
    name: "Trần Duy Phước Nghĩa",
    role: "Dev Team",
    quote: "\" \"",
    avatar: "/image/credit_members/PHP.jpeg",
    socials: {
      tiktok: "tiktok.com/...",
    }
  },
  {
    id: 5,
    name: "Nguyễn Huy Nhật",
    role: "Content Team",
    quote: "\" \"",
    avatar: "/image/credit_members/PHP.jpeg",
    socials: {
      tiktok: "tiktok.com/...",
    }
  },
  {
    id: 6,
    name: "Hàng Khang Định",
    role: "Content Team",
    quote: "\" \"",
    avatar: "/image/credit_members/HKD.jpg",
    socials: {
      tiktok: "tiktok.com/...",
    }
  },
  {
    id: 7,
    name: "Nguyễn Thị Hồng Ngọc",
    role: "Content Team",
    quote: "\" \"",
    avatar: "/image/credit_members/NTHN.jpg",
    socials: {
      tiktok: "tiktok.com/...",
    }
  },
  {
    id: 8,
    name: "Lê Nguyên Hào",
    role: "Content Team",
    quote: "\" \"",
    avatar: "/image/credit_members/LNH.jpg",
    socials: {
      tiktok: "tiktok.com/...",
    }
  },
  {
    id: 9,
    name: "Văn Huỳnh Như",
    role: "Illustrator",
    quote: "\" \"",
    avatar: "/image/credit_members/PHP.jpeg",
    socials: {
      tiktok: "tiktok.com/...",
    }
  }
];

const Footer: React.FC = () => {
  const [creditIndex, setCreditIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const [isCreditAnimating, setIsCreditAnimating] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoplayTimerRef = useRef<any>(null);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setSlideDirection("next");
      setIsCreditAnimating(true);
      setCreditIndex((prev) => (prev + 1) % CREDIT_MEMBERS.length);
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

  const handleNextCredit = () => {
    resetAutoplayTimer();
    setSlideDirection("next");
    setIsCreditAnimating(true);
    setCreditIndex((prev) => (prev + 1) % CREDIT_MEMBERS.length);
  };

  const handlePrevCredit = () => {
    resetAutoplayTimer();
    setSlideDirection("prev");
    setIsCreditAnimating(true);
    setCreditIndex((prev) => (prev - 1 + CREDIT_MEMBERS.length) % CREDIT_MEMBERS.length);
  };

  const handleCreditAnimationEnd = () => {
    setIsCreditAnimating(false);
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
      handleNextCredit();
      setTouchPosition(null);
    }

    // Vuốt sang phải (prev slide)
    if (diff < -50) {
      handlePrevCredit();
      setTouchPosition(null);
    }
  };

  return (
    <footer className="footer__container_01">
      <div className="footer__content_01">
        <div className="footer__info_01">
          <div className="footer__brand_01">
            <span className="footer__logo-text_01">BKTI</span>
            <span className="footer__tagline_01"> - Bach Khoa Type Indicator</span>
          </div>
          <p className="footer__description_01"> BKTI - gồm nội dung trang web, thiết kế và các hình ảnh minh họa là sản phẩm thuộc quyền sở hữu của 9 nhân vật phản diện thuộc BTT - khả ái và ngây ngất lòng người.
          </p>

          {/* Khối slide thành viên nhỏ gọn trong footer với 2 nút bấm điều hướng */}
          <div className="footer__credit-slider-wrapper_01" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
            {/* Nút mũi tên TRÁI */}
            <button 
              className="footer__credit-nav-btn_01 footer__credit-nav-left_01" 
              onClick={handlePrevCredit} 
              aria-label="Previous member"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {/* Khung nội dung hiển thị ở giữa */}
            <div className="footer__credit-slider_01">
              <div 
                className={`footer__member-card-content_01 ${
                  isCreditAnimating 
                    ? slideDirection === "next" 
                      ? "footer__slide-from-right_01" 
                      : "footer__slide-from-left_01" 
                    : ""
                }`}
                onAnimationEnd={handleCreditAnimationEnd}
              >
                {/* 1. Avatar phía bên trái */}
                <div className="footer__member-avatar-wrapper_01">
                  <img 
                    src={CREDIT_MEMBERS[creditIndex].avatar} 
                    alt={CREDIT_MEMBERS[creditIndex].name} 
                    className="footer__member-avatar_01"
                  />
                </div>

                {/* 2. Thông tin phía bên phải */}
                <div className="footer__member-details_01">
                  <h4 className="footer__member-name_01">{CREDIT_MEMBERS[creditIndex].name}</h4>
                  {CREDIT_MEMBERS[creditIndex].role && (
                    <p className="footer__member-role_01">{CREDIT_MEMBERS[creditIndex].role}</p>
                  )}
                  {CREDIT_MEMBERS[creditIndex].quote && (
                    <p className="footer__member-quote_01">{CREDIT_MEMBERS[creditIndex].quote}</p>
                  )}
                  {/* ── Cụm Icon Social ── */}
                  <div className="member-socials">
                    {CREDIT_MEMBERS[creditIndex].socials?.facebook && (
                      <a href={CREDIT_MEMBERS[creditIndex].socials.facebook} target="_blank" rel="noopener noreferrer" className="member-social-btn" title="Facebook">
                        <img src={FB} alt="Facebook" />
                      </a>
                    )}
                    {CREDIT_MEMBERS[creditIndex].socials?.instagram && (
                      <a href={CREDIT_MEMBERS[creditIndex].socials.instagram} target="_blank" rel="noopener noreferrer" className="member-social-btn" title="Instagram">
                        <img src={Ins} alt="Instagram" />
                      </a>
                    )}
                    {CREDIT_MEMBERS[creditIndex].socials?.tiktok && (
                      <a href={CREDIT_MEMBERS[creditIndex].socials.tiktok} target="_blank" rel="noopener noreferrer" className="member-social-btn" title="TikTok">
                        <img src={TT} alt="TikTok" />
                      </a>
                    )}
                    {CREDIT_MEMBERS[creditIndex].socials?.email && (
                      <a href={CREDIT_MEMBERS[creditIndex].socials.email} className="member-social-btn" title="Email">
                        <img src={Mail} alt="Email" />
                      </a>
                    )}
                    {CREDIT_MEMBERS[creditIndex].socials?.github && (
                      <a href={CREDIT_MEMBERS[creditIndex].socials.github} target="_blank" rel="noopener noreferrer" className="member-social-btn" title="GitHub">
                        <img src={Git} alt="GitHub" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Chỉ số trang hiển thị góc dưới */}
              <div className="footer__credit-page-indicator_01">
                {creditIndex + 1} / {CREDIT_MEMBERS.length}
              </div>
            </div>

            {/* Nút mũi tên PHẢI */}
            <button 
              className="footer__credit-nav-btn_01 footer__credit-nav-right_01" 
              onClick={handleNextCredit} 
              aria-label="Next member"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <div className="footer__meta_01">
          <p className="footer__text_01">
            Sản phẩm được thực hiện bởi <strong>Ban Truyền thông khoa Khoa học và Kỹ thuật Máy tính (BTT)</strong>.
          </p>
          <div className="footer__links_01">
            <a 
              href="https://www.facebook.com/BKCSE.Multimedia" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer__link_01"
            >
              Fanpage CSE Multimedia
            </a>
            <span className="footer__separator_01">|</span>
            <span className="footer__copyright_01">
              © {new Date().getFullYear()} BTT. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
