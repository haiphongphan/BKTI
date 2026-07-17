import CSEMul from "/image/CSE-mul.png";
import FB from "/image/facebook.svg";
import TT from "/image/tiktok.svg";
import Mail from "/image/mail.svg";
import Ins from "/image/ins.svg";
import "./popupstyle.css";


function Popup(){
  return (
    <div className="popup">
      <img className="ellipse" alt="Ellipse" src={CSEMul} />
      <div className="text-wrapper">@csemultimedia</div>
      <div className="group" >
        <img className="facebook" alt="Vector" src={FB} />
        <img className="tiktok" alt="Vector" src={TT} />
        <img className="mail" alt="Vector" src={Mail} />
        <img className="insta" alt="Vector" src={Ins} />
      </div>
      <div className="button">
        <div className="rectangle" />
        <p className="div">Bấm follow page để có thể làm bài</p>
      </div>
    </div>
  );
};
export default Popup