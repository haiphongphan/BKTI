import { Chart } from "../elements/spiderchart.tsx";
import React, { useEffect, useState } from 'react';
import "./resultstyle.css";

export default function Result() {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    // Lấy dữ liệu kết quả đã lưu từ localStorage khi trang Result vừa mở lên
    const savedResult = localStorage.getItem("quiz_result");
    if (savedResult) {
      setResult(JSON.parse(savedResult));
    }
  }, []);

  if (!result) return <div style={{ padding: '50px' }}>Đang tải kết quả...</div>;
  return (
    <div className="resultpage">
      <header className="header">
        <button className="nav-frame frame-5">
          <div className="nav-text text-wrapper-12">@cse-multimedia</div>
        </button>
        <button className="nav-logo" onClick={() => (window as any).navigateToHome?.()}>
          <img src="/image/CSE-small.png" alt="CSE Multimedia" className="nav-logo-img" />
        </button>
        <button className="nav-frame frame-6">
          <div className="nav-text text-wrapper-13">#BKTI</div>
        </button>
      </header>

      <main className="result-card">
        <div className="result-info">
          <span className="subtitle">Kiểu tính cách của bạn</span>
          
          {/* Hiển thị Tên nhóm tính cách + Mã Code (Ví dụ: Nhóm nhân sự ưu tú - INTJ) */}
          <h1 className="title">
            {result.name} {result.code ? `(${result.code})` : ''}
          </h1>
          
          {/* Hiển thị đoạn Mô tả tính cách thực tế từ Backend */}
          <p className="desc">
            {result.description}
          </p>

          <button className="back-btn" onClick={() => {
            // Dọn dẹp dữ liệu cũ khi quay về trang chủ
            localStorage.removeItem("quiz_result");
            (window as any).navigateToHome?.();
          }}>
            Quay lại Trang chủ
          </button>
        </div>

        <div className="result-chart">
          {/* Nếu linh kiện Chart của bạn cần truyền dữ liệu vào, hãy nhớ truyền qua prop */}
          <Chart /> 
        </div>
      </main>
    </div>
  );
}