import CSEMul from "../../image/CSE-mul.png";
import FB from "../../image/facebook.svg";
import TT from "../../image/tiktok.svg";
import Mail from "../../image/mail.svg";
import Web from "../../image/web.svg";
import "./popupstyle.css";

function Popup({onClose} : any){
  return (
    <div className="popup">
      <img className="ellipse" alt="Ellipse" src={CSEMul} />
      <div className="text-wrapper">@csemultimedia</div>
      <div className="group">
        <a 
          href="https://www.facebook.com/BKCSE.Multimedia" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-btn"
        >
          <img className="facebook" alt="Facebook" src={FB} />
        </a>
        <a 
          href="https://www.tiktok.com/@csemultimedia" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-btn"
        >
          <img className="tiktok" alt="TikTok" src={TT} />
        </a>
        <a 
          href="mailto:dtn-ktmt@hcmut.edu.vn" 
          className="social-btn"
        >
          <img className="mail" alt="Mail" src={Mail} />
        </a>
        <a 
          href="https://cse.hcmut.edu.vn/en" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-btn"
        >
          <img className="web" alt="Web" src={Web} />
        </a>
      </div>

      {/* ── Follow button — điều hướng về Home ── */}
      <div className="button">
        <button className="follow-btn" onClick={onClose}>
          Follow để cập nhật thông tin mới nhất của khoa KH-KT Máy tính nhé
        </button>
      </div>
      <button className="close-btn" onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default Popup;