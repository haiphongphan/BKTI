import { Chart } from "../elements/spiderchart.tsx";
import { useEffect, useState, useRef } from 'react';
import "./resultstyle.css";
import html2canvas from "html2canvas";

export default function Result() {
  const [result, setResult] = useState<any>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!captureRef.current) return;

    // Cuộn về đầu trang trước khi chụp
    window.scrollTo(0, 0);

    const element = captureRef.current;
    const canvas = await html2canvas(element, {
      backgroundColor: null, // giữ gradient nền trang
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
        el.classList?.contains("retry-btn"),
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
  return (
    <div className="resultpage" ref={captureRef}>
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

      <main className="result-card">
        <div className="result-info">
          {result.image_url && (
            <img 
              src={result.image_url} 
              alt={result.name} 
              className="personality-img" 
              style={{ maxWidth: '200px', marginBottom: '20px' }}
            />
          )}
          <span className="subtitle">Kiểu tính cách của bạn</span>
          
          {/* Hiển thị Tên nhóm tính cách + Mã Code (Ví dụ: Nhóm nhân sự ưu tú - INTJ) */}
          <h1 className="title">
            {result.name} {result.code ? `(${result.code})` : ''}
          </h1>
          
          {/* Hiển thị đoạn Mô tả tính cách thực tế từ Backend */}
          <p className="desc">
            {result.description}
          </p>

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

        <div className="result-chart">
          {/* Nếu linh kiện Chart của bạn cần truyền dữ liệu vào, hãy nhớ truyền qua prop */}
          <Chart /> 
        </div>
      </main>
    </div>
  );
}
