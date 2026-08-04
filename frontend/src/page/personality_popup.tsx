import co_be from "../../image/mochi/Co_be.png";
import lgbt from "../../image/mochi/Lgbt.png";
import onfa from "../../image/mochi/Onfa.png";
import max from "../../image/mochi/Max.png";
import tkka from "../../image/mochi/Tkka.png";
import svn8 from "../../image/mochi/Svn8.png";
import mtp from "../../image/mochi/Mtp.png";
import bugs from "../../image/mochi/Bugs.png";
import secret from "../../image/mochi/secret.png"
import "./personality_popupstyle.css";

const PERSONALITY_ITEMS = [
  { img: co_be, label: "Cô bé đi lạc" },
  { img: lgbt, label: "LGBT" },
  { img: onfa, label: "ONFA" },
  { img: max, label: <>Tối đa<br />Verstappen</> },
  { img: tkka, label: <>TKKA<br />(Thủ khoa khối A)</> },
  { img: svn8, label: "SVN8" },
  { img: mtp, label: "Núi Rừng MTV" },
  { img: bugs, label: "BUGS" },
  { img: secret, label: "Bí mật hehe" },
  { img: secret, label: "Bí mật hehe" },
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