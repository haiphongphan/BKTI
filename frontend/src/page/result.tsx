import { Chart } from "../elements/spiderchart.tsx";
import { useEffect, useState, useRef } from 'react';
import "./resultstyle.css";
import html2canvas from "html2canvas";
import { ProgressBar } from "../elements/progressbar.tsx";
import Footer from "../elements/footer.tsx";

export default function Result() {
  const [result, setResult] = useState<any>(null);
  const captureRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="result-page-wrapper">
      <div className="resultpage">
        <header className="header">
          <button className="nav-frame frame-5">
            <div className="nav-text text-wrapper-12">@cse-multimedia</div>
          </button>
          <button className="nav-logo" onClick={() => (window as any).navigateToHome?.()}>
            <img src="/image/cse-small.png" alt="CSE Multimedia" className="nav-logo-img" />
          </button>
          <button className="nav-frame frame-6">
            <div className="nav-text text-wrapper-13">#BKTI</div>
          </button>
        </header>

        <main className="result-container" ref={captureRef}>
          {/* Khối 1: Hình ảnh & Thông tin tính cách */}
          <div className="result-block-1">
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
          </div>

          {/* Khối 2: Biểu đồ spider, hệ 6 thanh thống kê và các button chức năng */}
          <div className="result-block-2">
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
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
