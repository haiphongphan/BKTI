import React from "react";
import "./personality_popupstyle.css";

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
  return (
    <div className="personality">
      <p className="title">Các kiểu tính cách trong bài kiểm tra</p>
      <button className="close-btn" onClick={onClose} aria-label="Đóng">
        &times;
      </button>

      {/* Lưới chứa 10 hình mẫu tính cách */}
      <div className="personality-grid">
        {PERSONALITY_ITEMS.map((item, index) => (
          <div className="personality-item" key={index}>
            <div className="img-wrapper">
              <img 
                src={item.img} 
                alt={typeof item.label === 'string' ? item.label : "Personality Avatar"} 
                className="rectangle-img"
                loading="lazy"      /* Giúp tải nhẹ nhàng trên di động */
                decoding="async"    /* Giải mã ảnh không gây đơ/khựng UI */
              />
            </div>
            <span className="item-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}