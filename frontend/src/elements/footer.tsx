import React, { useState, useEffect, useRef } from 'react';
import './footerstyle.css';
import FB from "/image/facebook.svg";
import TT from "/image/tiktok.svg";
import Mail from "/image/mail.svg";
import Ins from "/image/ins.svg";
import Git from "/image/github.svg";
import Personality from '../page/personality_popup';

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export interface Personality {
  code: string;
  name: string;
  description: string;
  image_url: string;
  music_url: string;
  dimension1_nguoi_im_lang: number;
  dimension1_nguoi_hay_noi: number;
  dimension2_vibecoder: number;
  dimension2_handmade: number;
  dimension3_chua_lanh: number;
  dimension3_mutant: number;
}

interface MemberSocials {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  email?: string;
  github?: string;
  easterEgg?: Personality; // Định nghĩa tùy chọn cho Easter Egg
}

interface Member {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  socials?: MemberSocials;
}

function boldUppercase(text: string) {
  return text.split("").map((char, i) => char >= "A" && char <= "Z" ? (<strong key={i}>{char}</strong>) : (char));
}

const CREDIT_MEMBERS : Member[] = [
  {
    id: 1,
    name: "Đinh Quốc Thịnh",
    role: "Lead Content",
    quote: '"Ước gì một ngày có 36 tiếng để có thể ngủ 12 tiếng."',
    avatar: "/image/credit_members/DQT.webp",
    socials: {
      instagram: "https://www.instagram.com/biinseventeen",
    },
  },
  {
    id: 2,
    name: "Phan Hải Phong",
    role: "Lead Dev",
    quote:
      '"Họ cười tôi vì tôi không giống họ, tôi cười họ vì tưởng họ cười với tôi 🤡"',
    avatar: "/image/credit_members/PHP.webp",
    socials: {
      facebook: "https://www.facebook.com/phongphanhai06",
      instagram: "https://www.instagram.com/phongphanhai06",
      email: "mailto:phong.phan06@hcmut.edu.vn"
    },
  },
  {
    id: 3,
    name: "Lâm Chí Nguyên",
    role: "Dev Team",
    quote: '"I be sleeping tomorrow like yesterday? Bro, I slept today!"',
    avatar: "/image/credit_members/N.webp",
    socials: {
      github: "https://github.com/NieChan17",
      instagram: "https://www.instagram.com/_niechan",
      facebook: "https://www.facebook.com/lamm.nguyenn.17",
    },
  },
  {
    id: 4,
    name: "Trần Duy Phước Nghĩa",
    role: "Dev Team",
    quote: "\"Young Ones should Understand that great Achievement Requires Endless Grind, burning Ambition and unwavering constancY!\"",
    avatar: "/image/credit_members/TDPN.webp",
    socials: {
      instagram: "https://www.instagram.com/_pngh1a_/",
    }
  },
  {
    id: 5,
    name: "Nguyễn Huy Nhật",
    role: "Content Team",
    quote: "\"Cuộc sống như wifi, đứng đúng chỗ thì bắt được sống\"",
    avatar: "/image/credit_members/NHN.webp",
    socials: {
      instagram: "https://www.instagram.com/uhwsnaht.06/",
    }
  },
  {
    id: 6,
    name: "Hàng Khang Định",
    role: "Content Team",
    quote: '"Tôi đã trưởng thành từ trong đau khổ, tôi đứng lên từ đống tro tàn, tôi đứng lên từ một đống tro tàn nguội lạnh, như một bông hoa nở giữa sa mạc và tôi có ngày hôm nay là do tôi may mắn cộng thêm một sự kiêu hãnh kiên định không có dễ gì lung lay tôi đâu, thấy tôi cười đừng nghĩ tôi vui, mà thấy tôi khóc đừng nghĩ tôi buồn. Cái đầu của tôi tỉnh như tỉnh Ủy."',
    avatar: "/image/credit_members/HKD.webp",
    socials: {
      instagram: "https://www.instagram.com/whwsmdfr",
      facebook: "https://www.facebook.com/apl.gind"
    },
  },
  {
    id: 7,
    name: "Nguyễn Thị Hồng Ngọc",
    role: "Content Team",
    quote: "\"Hai mươi phút ngủ trưa là hai tiếng đáng nhớ nhất trong ngày.\"",
    avatar: "/image/credit_members/NTHN.webp",
  },
  {
    id: 8,
    name: "Lê Nguyên Hào",
    role: "Content Team",
    quote: "\"Người hay nói đạo lý là người sống như loài bươm bướm\"",
    avatar: "/image/credit_members/LNH.webp",
    socials: {
      instagram: "https://www.instagram.com/ngynhcao.l7ll"
    }
  },
  {
    id: 9,
    name: "Văn Huỳnh Như",
    role: "Illustrator",
    quote: "\"Beauty and the bed\"",
    avatar: "/image/credit_members/VHN.webp",
    socials: {
      instagram: "https://www.instagram.com/nhu.hyunie/",
    }
  },
  {
    id: 10,
    name: "Mochi",
    role: "Kéo Tương Tác Cho Page",
    quote: "\"Bí mật nằm đâu đó quanh đây...\"",
    avatar: "/image/credit_members/Mochi.webp?v=2",
    socials: {
      facebook: "https://www.facebook.com/share/p/1PfTtGMXdx/",
      tiktok: "https://www.tiktok.com/@csemultimedia",
      email: "mailto:dtn-ktmt@hcmut.edu.vn",
      easterEgg: {
        code: "LMAO",
        name: "JZTR",
        description:
          "Đó chính xác là tiếng lòng mà những chủ nhân của BKTI dành cho bạn. Trong khi người khác đang miệt mài trả lời những câu hỏi khảo sát để tìm ra bản ngã, bạn lại lục lọi phần Credit của một chiếc web. Rốt cuộc mục đích của bạn là gì vậy? Tìm chúng mình \"hỏi tội\" vì bài test không chính xác? Hay bạn là nhà tuyển dụng đang tìm thông tin của những con người xuất sắc này để chiêu mộ về công ty? Dù mục đích của bạn là gì đi chăng nữa, chúc mừng bạn đã tìm ra 1 trong 2 tính cách ẩn của bài test lần này!",
        image_url: "/image/mochi/Jztr.webp",
        music_url: "/music/jztr.mp3",
        dimension1_nguoi_im_lang: 101,
        dimension1_nguoi_hay_noi: 101,
        dimension2_vibecoder: 101,
        dimension2_handmade: 101,
        dimension3_chua_lanh: 101,
        dimension3_mutant: 101
      },
    },
  },
];

const Footer: React.FC = () => {
  const [creditIndex, setCreditIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const [isCreditAnimating, setIsCreditAnimating] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoplayTimerRef = useRef<any>(null);
  const handleEasterEggClick = async (
    e: React.MouseEvent,
    secretJZTR: Personality,
  ) => {
    e.preventDefault();
    // Chuyển hướng tới trang kết quả tính cách đặc biệt (ví dụ: /result/JZTR)
    localStorage.setItem("quiz_result", JSON.stringify(secretJZTR));
    try {
        await fetch(`${API_URL}/quiz/secret-submit/LMAO`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        console.error("Lỗi gửi Easter Egg:", error);
      }
    // Chuyển ngay sang trang Result
    if ((window as any).navigateToResult) {
      (window as any).navigateToResult();
    }
  };

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
    setCreditIndex(
      (prev) => (prev - 1 + CREDIT_MEMBERS.length) % CREDIT_MEMBERS.length,
    );
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
            <span className="footer__tagline_01">
              {" "}
              - Bach Khoa Type Indicator
            </span>
          </div>
          <p className="footer__description_01">
            {" "}
            BKTI - gồm nội dung trang web, thiết kế và các hình ảnh minh họa là
            sản phẩm thuộc quyền sở hữu của 9 nhân vật phản diện và 1 kẻ gánh team thuộc BTT - khả
            ái và ngây ngất lòng người.
          </p>

          {/* Khối slide thành viên nhỏ gọn trong footer với 2 nút bấm điều hướng */}
          <div
            className="footer__credit-slider-wrapper_01"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            {/* Nút mũi tên TRÁI */}
            <button
              className="footer__credit-nav-btn_01 footer__credit-nav-left_01"
              onClick={handlePrevCredit}
              aria-label="Previous member"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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
                  <h4 className={(CREDIT_MEMBERS[creditIndex].id === 4) ? "footer__member-name_01--small" : "footer__member-name_01"}>{CREDIT_MEMBERS[creditIndex].name}</h4>
                  {CREDIT_MEMBERS[creditIndex].role && (
                    <p className="footer__member-role_01">
                      {CREDIT_MEMBERS[creditIndex].role}
                    </p>
                  )}
                  {CREDIT_MEMBERS[creditIndex].quote && CREDIT_MEMBERS[creditIndex].id === 6 && (
                    <p className={"footer__member-quote_01 footer__member-quote_01--verysmall"}>
                      {CREDIT_MEMBERS[creditIndex].quote}
                    </p>
                  )}
                  {CREDIT_MEMBERS[creditIndex].quote && CREDIT_MEMBERS[creditIndex].id !== 6 &&(
                    <p className={CREDIT_MEMBERS[creditIndex].id === 4 ? "footer__member-quote_01 footer__member-quote_01--small" : "footer__member-quote_01"}>
                      {CREDIT_MEMBERS[creditIndex].id === 4 ? boldUppercase(CREDIT_MEMBERS[creditIndex].quote) : CREDIT_MEMBERS[creditIndex].quote}
                    </p>
                  )}
                  {/* ── Cụm Icon Social ── */}
                  <div className="member-socials">
                    {CREDIT_MEMBERS[creditIndex].socials?.facebook && (
                      <a
                        href={CREDIT_MEMBERS[creditIndex].socials.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="member-social-btn"
                        title="Facebook"
                      >
                        <img src={FB} alt="Facebook" />
                      </a>
                    )}
                    {CREDIT_MEMBERS[creditIndex].socials?.instagram && (
                      <a
                        href={CREDIT_MEMBERS[creditIndex].socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="member-social-btn"
                        title="Instagram"
                      >
                        <img src={Ins} alt="Instagram" />
                      </a>
                    )}
                    {CREDIT_MEMBERS[creditIndex].socials?.tiktok && (
                      <a
                        href={CREDIT_MEMBERS[creditIndex].socials.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="member-social-btn"
                        title="TikTok"
                      >
                        <img src={TT} alt="TikTok" />
                      </a>
                    )}
                    {CREDIT_MEMBERS[creditIndex].socials?.easterEgg && (
                      <a
                        className="member-social-btn"
                        title="Bí mật Mochi"
                        onClick={(e) =>
                          handleEasterEggClick(
                            e,
                            CREDIT_MEMBERS[creditIndex].socials!.easterEgg!,
                          )
                        }
                      >
                        <img src="/image/secret_icon.svg" alt="Easter Egg" />
                      </a>
                    )}
                    {CREDIT_MEMBERS[creditIndex].socials?.email && (
                      <a
                        href={CREDIT_MEMBERS[creditIndex].socials.email}
                        className="member-social-btn"
                        title="Email"
                      >
                        <img src={Mail} alt="Email" />
                      </a>
                    )}
                    {CREDIT_MEMBERS[creditIndex].socials?.github && (
                      <a
                        href={CREDIT_MEMBERS[creditIndex].socials.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="member-social-btn"
                        title="GitHub"
                      >
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
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <div className="footer__meta_01">
          <p className="footer__text_01">
            Sản phẩm được thực hiện bởi{" "}
            <strong>
              Ban Truyền thông khoa Khoa học và Kỹ thuật Máy tính
            </strong>
            .
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
              © {new Date().getFullYear()} CSE-Multimedia. All rights reserved.
            </span>
          </div>
          <p className="footer__special-thanks_01">
            Special thanks to: <span>Dé Sontune Montepré (Sơn Tùng MTP)</span> • <span>Max Verstappen</span> • <span>なみりん (*namirin)</span> • <span>Cô Xuân Anh</span> • <span>Nhà Thám Hiểm - ATVNCG</span> • <span>Trần My</span> • <span>Gemini 3.6 Flash</span> • <span>Suno-AI</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
