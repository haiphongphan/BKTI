import { Chart } from "../elements/spiderchart.tsx";
import { useEffect, useState, useRef } from 'react';
import "./resultstyle.css";
import html2canvas from "html2canvas";
import { ProgressBar } from "../elements/progressbar.tsx";
import TiltCard from "../elements/tiltcard";
import Navbar from "../elements/navbar";
import Footer from "../elements/footer.tsx";
import confetti from 'canvas-confetti';

export default function Result() {
  const [result, setResult] = useState<any>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleDownload = async () => {
    if (!captureRef.current) return;

    // Cuộn về đầu trang trước khi chụp
    window.scrollTo(0, 0);

    const element = captureRef.current;
    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff", // Bổ sung nền trắng phía sau ảnh chụp
      scale: 2,
      useCORS: true,
      allowTaint: true,
      // Chụp đủ chiều cao/rộng của cả trang
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      ignoreElements: (el) =>
        el.classList?.contains("result-actions") ||
        el.classList?.contains("save-answer-btn") ||
        el.classList?.contains("back-btn") ||
        el.classList?.contains("retry-btn") ||
        el.tagName?.toLowerCase() === "footer",
    });

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `BKTI-${result.code || "result"}.png`;
    link.click();
  };

  useEffect(() => {
    // Lấy dữ liệu kết quả đã lưu từ localStorage khi trang Result vừa mở lên
    const savedResult = localStorage.getItem("quiz_result");
    if (savedResult) {
      setResult(JSON.parse(savedResult));
    }
  }, []);

  useEffect(() => {
  const savedResult = localStorage.getItem("quiz_result");
  if (!savedResult) return;

  const parsedResult = JSON.parse(savedResult);
  setResult(parsedResult);

  if (parsedResult.music_url) {
    // 1. Khai báo Audio
    const audio = new Audio(parsedResult.music_url);
    audio.loop = true;
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

  const stats = [
    { label: 'Im Lặng', value: result.dimension1_nguoi_im_lang || 0 },
    { label: 'Hay Nói', value: result.dimension1_nguoi_hay_noi || 0 },
    { label: 'VibeCoder', value: result.dimension2_vibecoder || 0 },
    { label: 'Handmade', value: result.dimension2_handmade || 0 },
    { label: 'Chữa Lành', value: result.dimension3_chua_lanh || 0 },
    { label: 'Mutant', value: result.dimension3_mutant || 0 },
  ];

  const scores = [
    result.dimension1_nguoi_im_lang || 0,
    result.dimension1_nguoi_hay_noi || 0,
    result.dimension2_vibecoder || 0,
    result.dimension2_handmade || 0,
    result.dimension3_chua_lanh || 0,
    result.dimension3_mutant || 0,
  ];

  const handleNavClick = (target: 'home' | 'ranking' | 'personality' | 'faq' | 'credit') => {
    if (target === 'home') {
      (window as any).navigateToHome?.();
    } else {
      localStorage.setItem("nav_target", target);
      (window as any).navigateToHome?.();
    }
  };

  return (
    <div className="result-page-wrapper">
      <div className="resultpage">
        <Navbar onNavClick={handleNavClick} />

        <main className="result-container" ref={captureRef}>
          {/* Khối 1: Hình ảnh & Thông tin tính cách */}
          <TiltCard className="result-block-1">
            {result.image_url && (
              <img 
                src={result.image_url} 
                alt={result.name} 
                className="personality-img" 
                style={{ maxWidth: '200px', marginBottom: '20px' }}
              />
            )}
            <span className="subtitle">Kiểu tính cách của bạn</span>
            
            {/* Hiển thị Tên nhóm tính cách + Mã Code */}
            <h1 className="title">
              {result.name} {result.code ? `(${result.code})` : ''}
            </h1>
            
            {/* Hiển thị đoạn Mô tả tính cách thực tế từ Backend */}
            <p className="desc">
              {result.description}
            </p>
          </TiltCard>

          {/* Khối 2: Biểu đồ spider, hệ 6 thanh thống kê và các button chức năng */}
          <TiltCard className="result-block-2">
            <div className="result-chart">
              <Chart scores={scores} /> 
            </div>

            {/* Hệ thống 6 thanh thống kê ProgressBar */}
            <div className="stats-container">
              {stats.map(stat => (
                <div className="stat-row" key={stat.label}>
                  <div className="stat-info">
                    <span className="stat-label">{stat.label}</span>
                    <span className="stat-value">{Math.round(stat.value)}%</span>
                  </div>
                  <div className="stat-progress">
                    <ProgressBar current={stat.value} total={100} showText={false} />
                  </div>
                </div>
              ))}
            </div>

            <div className="result-actions">
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
          </TiltCard>
        </main>
      </div>
      <Footer />
    </div>
  );
}
