import { Chart } from "../elements/spiderchart.tsx";
import { useEffect, useState, useRef } from 'react';
import "./resultstyle.css";
import html2canvas from "html2canvas";
import { DualBar } from "../elements/dualbar.tsx";
import TiltCard from "../elements/tiltcard";
import Navbar from "../elements/navbar";
import Footer from "../elements/footer.tsx";
import confetti from 'canvas-confetti';
import TechBackground from "../elements/techbackground";
import { ADVICE_MAP } from "./advicedata.ts";
import Pers_popup from "./personality_popup";
import FAQ from "./FAQ";


// Ở đây là advice cho mỗi chiều tính cách
// 3 chiều tâm lý — mỗi chiều là 1 cặp đối lập
const DIMENSIONS = [
  { leftLabel: "Im Lặng", rightLabel: "Hay Nói", leftKey: "dimension1_nguoi_im_lang", rightKey: "dimension1_nguoi_hay_noi" },
  { leftLabel: "VibeCoder", rightLabel: "Handmade", leftKey: "dimension2_vibecoder", rightKey: "dimension2_handmade" },
  { leftLabel: "Chữa Lành", rightLabel: "Mutant", leftKey: "dimension3_chua_lanh", rightKey: "dimension3_mutant" },
];
// Phong xem ở đây và file advice.ts

export default function Result() {
  const [result, setResult] = useState<any>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Expand/collapse description trên mobile
  const [descExpanded, setDescExpanded] = useState(false);

  // Trạng thái hiển thị popup ngay tại trang
  const [persPopup, setPersPopup] = useState(false);
  const [faq, setFaq] = useState(false);

  const handleDownload = async () => {
    if (!captureRef.current) return;

    // Cuộn về đầu trang trước khi chụp
    window.scrollTo(0, 0);

    const element = captureRef.current;
    const canvas = await html2canvas(element, {
      backgroundColor: "#ebdfff", // Đổi từ #ffffff sang #ebdfff để khớp màu nền, ẩn vết nứt/lệch trắng bên phải
      scale: 2,
      useCORS: true,
      allowTaint: true,
      onclone: (clonedDoc) => {
        const shareArea = clonedDoc.querySelector(".result-share-area") as HTMLElement;
        if (shareArea) {
          shareArea.classList.add("is-capturing");
        }
      },
      ignoreElements: (el) =>
        el.classList?.contains("result-actions") ||
        el.classList?.contains("save-answer-btn") ||
        el.classList?.contains("back-btn") ||
        el.classList?.contains("retry-btn") ||
        el.tagName?.toLowerCase() === "footer",
    });

    const dataUrl = canvas.toDataURL("image/webp");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `BKTI-${result.code || "result"}.png`;
    link.click();
  };


  useEffect(() => {
  const savedResult = localStorage.getItem("quiz_result");
  if (!savedResult) return;

  const parsedResult = JSON.parse(savedResult);
  setResult(parsedResult);

  if (parsedResult.music_url) {
    // 1. Khai báo Audio
    const audio = new Audio(parsedResult.music_url);
    audio.loop = false;
    audio.volume = 0.7;
    audioRef.current = audio;

    // 2. Hàm phát nhạc
    const playAudio = () => {
      audio.play().then(() => {
        // Nếu phát thành công, gỡ bỏ sự kiện click lắng nghe
        window.removeEventListener("click", playAudio);
        window.removeEventListener("touchstart", playAudio);
      }).catch((err) => {
        console.log("Chờ người dùng tương tác để phát nhạc...", err);
      });
    };

    // Thử phát ngay lập tức
    playAudio();

    // 3. Nếu trình duyệt chặn, gắn sự kiện click toàn cục để phát nhạc ngay cú chạm đầu tiên
    window.addEventListener("click", playAudio);
    window.addEventListener("touchstart", playAudio);

    // 4. Cleanup khi rời trang Result
    return () => {
      window.removeEventListener("click", playAudio);
      window.removeEventListener("touchstart", playAudio);
      audio.pause();
      audioRef.current = null;
    };
  }
}, []); // Mảng rỗng [] đảm bảo chỉ khởi tạo đúng 1 lần
  useEffect(() => {
    const duration = 2.5 * 1000; // Bắn trong 2.5 giây
    const animationEnd = Date.now() + duration;

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      // Bắn ngẫu nhiên từ góc trái và phải
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#7b61ff', '#998fc7', '#ffd11a']
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#7b61ff', '#998fc7', '#ffd11a']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  if (!result) return <div style={{ padding: '50px' }}>Đang tải kết quả...</div>;

  const scores = [
    result.dimension1_nguoi_im_lang || 0,
    result.dimension2_vibecoder || 0,
    result.dimension3_chua_lanh || 0,
    result.dimension1_nguoi_hay_noi || 0,
    result.dimension2_handmade || 0,
    result.dimension3_mutant || 0,
  ];

  const adviceList = [
    (result.dimension1_nguoi_im_lang || 0) >= (result.dimension1_nguoi_hay_noi || 0)
      ? ADVICE_MAP.dimension1_nguoi_im_lang
      : ADVICE_MAP.dimension1_nguoi_hay_noi,
    (result.dimension2_vibecoder || 0) >= (result.dimension2_handmade || 0)
      ? ADVICE_MAP.dimension2_vibecoder
      : ADVICE_MAP.dimension2_handmade,
    (result.dimension3_chua_lanh || 0) >= (result.dimension3_mutant || 0)
      ? ADVICE_MAP.dimension3_chua_lanh
      : ADVICE_MAP.dimension3_mutant,
  ];

  const handleNavClick = (target: 'home' | 'ranking' | 'personality' | 'faq' | 'credit') => {
    if (target === 'home') {
      (window as any).navigateToHome?.();
    } else if (target === 'ranking') {
      localStorage.setItem("nav_target", target);
      (window as any).navigateToHome?.();
    } else if (target === 'personality') {
      setPersPopup(true);
    } else if (target === 'faq') {
      setFaq(true);
    } else if (target === 'credit') {
      const el = document.querySelector(".footer__container_01");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="result-page-wrapper">
      <TechBackground />
      <Navbar onNavClick={handleNavClick} />

      {persPopup && (
        <div className="popup-overlay" onClick={() => setPersPopup(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <Pers_popup onClose={() => setPersPopup(false)} />
          </div>
        </div>
      )}

      {faq && (
        <div className="popup-overlay" onClick={() => setFaq(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <FAQ onClose={() => setFaq(false)} />
          </div>
        </div>
      )}

      {/* ── Hero Section đặt ngoài để fill hết chiều ngang ── */}
      <section className="result-hero-section">
        <div className="result-hero-content">
          <h1 className="result-hero-title">Đã tìm thấy bản ngã của bạn!</h1>
          <p className="result-hero-subtitle">
            Xem chi tiết phân tích tính cách sinh viên Bách khoa của bạn bên dưới, tải ảnh kết quả về để chia sẻ cùng bạn bè nhé!
          </p>
        </div>
      </section>

      <div className="resultpage">
        {/* Vùng chụp ảnh lưu trữ (không bao gồm các nút bấm hành động) */}
        <div className="result-share-area" ref={captureRef}>
          <main className="result-container">
            {/* Khối 1: Hình ảnh & Thông tin tính cách */}
            <TiltCard className="result-block-1">
              {result.image_url && (
                <img 
                  src={`${result.image_url}?v=2`} 
                  alt={result.name} 
                  className="personality-img" 
                  style={{ maxWidth: '450px', marginBottom: '20px' }}
                />
              )}
              <span className="subtitle">Kiểu tính cách của bạn</span>
              
              {/* Hiển thị Tên nhóm tính cách + Mã Code */}
              <h1 className="title">
                {result.name} {result.code ? `(${result.code})` : ''}
              </h1>
              
              {/* Hiển thị đoạn Mô tả tính cách — thu gọn trên mobile */}
              <p className={`desc ${descExpanded ? "desc--expanded" : ""}`}>
                {result.description}
              </p>
              <button
                className="desc-toggle-btn"
                onClick={() => setDescExpanded(!descExpanded)}
              >
                {descExpanded ? "Thu gọn ▲" : "Xem thêm ▼"}
              </button>
            </TiltCard>

            {/* Khối 2: Biểu đồ spider & 3 cặp stats đối lập */}
            <TiltCard className="result-block-2">
              {/* Section 1: Spider Chart */}
              <div className="result-section">
                <h3 className="result-section-title">Bản đồ đa chiều</h3>
                <p className="result-section-desc">Trực quan hóa mức độ phân bố của bạn trên cả 6 chiều tính cách đặc trưng.</p>
                <div className="result-chart">
                  <Chart scores={scores} /> 
                </div>
              </div>

              {/* Section 2: DualBar Stats */}
              <div className="result-section">
                <h3 className="result-section-title">Chỉ số tâm lý đối lập</h3>
                <p className="result-section-desc">Đánh giá chi tiết tỉ lệ phần trăm giữa các xu hướng hành vi đối lập.</p>
                <div className="stats-container">
                  {DIMENSIONS.map((dim) => (
                    <DualBar
                      key={dim.leftKey}
                      leftLabel={dim.leftLabel}
                      rightLabel={dim.rightLabel}
                      leftValue={result[dim.leftKey] || 0}
                      rightValue={result[dim.rightKey] || 0}
                    />
                  ))}
                </div>
              </div>

              {/* Section 3: Advice List */}
              <div className="result-section">
                <h3 className="result-section-title">Lời khuyên phát triển</h3>
                <p className="result-section-desc">Gợi ý tối ưu hóa thế mạnh và cải thiện bản thân trong môi trường Bách khoa.</p>
                <div className="result-advice-container">
                  {adviceList.map((adv, idx) => (
                    <div className="result-advice-item" key={idx}>
                      <span className="result-advice-bullet">✦</span>
                      <div className="result-advice-content">
                        <strong className="result-advice-title">{adv.title}: </strong>
                        <span className="result-advice-text">{adv.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </main>

          {/* Dải thương hiệu chèn dưới chân ảnh chụp lưu trữ chia sẻ */}
          <div className="result-share-branding">
            <div className="branding-left">
              <img src="/image/bkti_logo.webp?v=2" alt="BKTI Logo" className="branding-logo" />
              <div className="branding-text">
                <span className="brand-name">BKTI</span>
                <span className="brand-desc">Trắc nghiệm tính cách SV Bách khoa</span>
              </div>
            </div>
            <div className="branding-right">
              <span className="brand-url">bkti.id.vn</span>
            </div>
          </div>
        </div>

        {/* Các nút hành động nằm ngoài vùng chụp ảnh */}
        <div className="result-actions-outer">
          <button className="retry-btn" onClick={() => {
            localStorage.removeItem("quiz_result");
            (window as any).navigateToAnswer?.();
          }}>
            Làm lại
          </button>

          <button className="save-answer-btn" onClick={handleDownload}>
            Tải ảnh kết quả
          </button>

          <button className="back-btn" onClick={() => {
            localStorage.removeItem("quiz_result");
            (window as any).navigateToHome?.();
          }}>
            Quay lại Trang chủ
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
