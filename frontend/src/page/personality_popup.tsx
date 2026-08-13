import co_be from "/image/mochi/Co_be.webp";
import lgbt from "/image/mochi/Lgbt.webp";
import onfa from "/image/mochi/Onfa.webp";
import max from "/image/mochi/max_square.webp";
import tkka from "/image/mochi/Tkka.webp";
import svn8 from "/image/mochi/Svn8.webp";
import mtp from "/image/mochi/Mtp.webp";
import bugs from "/image/mochi/Bugs.webp";
import secret from "/image/mochi/secret.webp"
import "./personality_popupstyle.css";

const PERSONALITY_ITEMS = [
  { img: co_be + "?v=2", label: "Cô bé đi lạc" },
  { img: lgbt + "?v=2", label: "LGBT" },
  { img: onfa + "?v=2", label: "ONFA" },
  { img: max + "?v=2", label: <>Tối đa<br />Verstappen</> },
  { img: tkka + "?v=2", label: <>TKKA<br />(Thủ khoa khối A)</> },
  { img: svn8 + "?v=2", label: "SVN8" },
  { img: mtp + "?v=2", label: "Núi Rừng MTV" },
  { img: bugs + "?v=2", label: "BUGS" },
  { img: secret + "?v=2", label: "Bí mật hehe" },
  { img: secret + "?v=2", label: "Bí mật hehe" },
];

export default function Personality({ onClose }: { onClose: () => void }) {
  return (
    <div className="personality">
      <p className="title">Các kiểu tính cách trong bài kiểm tra</p>
      <button className="close-btn" onClick={onClose}>
        &times;
      </button>

      {/* Lưới chứa 10 hình mẫu tính cách */}
      <div className="personality-grid">
        {PERSONALITY_ITEMS.map((item, index) => (
          <div className="personality-item" key={index}>
            <div className="img-wrapper">
              <img src={item.img} alt="Personality Avatar" className="rectangle-img" />
            </div>
            <span className="item-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}