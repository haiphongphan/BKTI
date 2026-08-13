import React, { useEffect } from "react";
import "./personality_popupstyle.css";

// Helper lấy đường dẫn tĩnh
const getMochiImg = (path: string) => `/image/mochi/${path}?v=2`;

const PERSONALITY_ITEMS = [
  { img: getMochiImg("Co_be.webp"), label: "Cô bé đi lạc" },
  { img: getMochiImg("Lgbt.webp"), label: "LGBT" },
  { img: getMochiImg("Onfa.webp"), label: "ONFA" },
  { img: getMochiImg("max_square.webp"), label: <>Tối đa<br />Verstappen</> },
  { img: getMochiImg("Tkka.webp"), label: <>TKKA<br />(Thủ khoa khối A)</> },
  { img: getMochiImg("Svn8.webp"), label: "SVN8" },
  { img: getMochiImg("Mtp.webp"), label: "Núi Rừng MTV" },
  { img: getMochiImg("Bugs.webp"), label: "BUGS" },
  { img: getMochiImg("secret.webp"), label: "Bí mật hehe" },
  { img: getMochiImg("secret.webp"), label: "Bí mật hehe" },
];

export default function Personality({ onClose }: { onClose: () => void }) {
  // Preload toàn bộ 10 ảnh vào RAM ngay khi Popup được mount
  useEffect(() => {
    PERSONALITY_ITEMS.forEach((item) => {
      const img = new Image();
      img.src = item.img;
    });
  }, []);

  return (
    // Bọc lớp overlay để chống lỗi Stacking Context trên Safari iOS
    <div className="personality-overlay" onClick={onClose}>
      <div className="personality" onClick={(e) => e.stopPropagation()}>
        <p className="title">Các kiểu tính cách trong bài kiểm tra</p>
        <button className="close-btn" onClick={onClose} aria-label="Đóng">
          &times;
        </button>

        <div className="personality-grid">
          {PERSONALITY_ITEMS.map((item, index) => (
            <div className="personality-item" key={index}>
              <div className="img-wrapper">
                <img 
                  src={item.img} 
                  alt="Personality Avatar" 
                  className="rectangle-img"
                  loading="eager"       /* Dùng eager thay cho lazy trong Popup */
                  decoding="async"      /* Xử lý giải mã ảnh ngầm */
                />
              </div>
              <span className="item-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}