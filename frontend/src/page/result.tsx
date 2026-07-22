import { Chart } from "../elements/spiderchart.tsx";
import "./resultstyle.css";

export default function Result() {
  return (
    <div className="resultpage">
      <header className="header">
        <button className="nav-frame frame-5">
          <div className="nav-text text-wrapper-12">@cse-multimedia</div>
        </button>
        <button className="nav-frame frame-6">
          <div className="nav-text text-wrapper-13">#BKTI</div>
        </button>
        <button className="nav-logo">
          <img src="/image/CSE-small.png" alt="CSE Multimedia" className="nav-logo-img" />
        </button>
        <button className="nav-frame frame-7">
          <span className="nav-text text-wrapper-14">ENG/VIE</span>
        </button>
      </header>

      <main className="result-card">
        <div className="result-info">
          <span className="subtitle">Kiểu tính cách của bạn</span>
          <h1 className="title">Nhóm nhân sự ưu tú</h1>
          <p className="desc">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
            rhoncus, quam vel lobortis fermentum, sem ipsum suscipit turpis,
            eleifend luctus nibh turpis et nulla. Sed luctus purus orci, vel porta
            turpis viverra ut. Sed dignissim mi eget lorem tincidunt, et iaculis
            mauris vestibulum. Morbi sit amet pellentesque turpis. Cras vulputate
            laoreet blandit.
          </p>
          <button className="back-btn" onClick={() => (window as any).navigateToHome?.()}>
            Quay lại Trang chủ
          </button>
        </div>

        <div className="result-chart">
          <Chart />
        </div>
      </main>
    </div>
  );
}