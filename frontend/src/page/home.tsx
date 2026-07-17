import "./homestyle.css";

/* Vị trí top (px) của từng hàng trong bảng xếp hạng */
const RANKING_TOP_POSITIONS = [512, 562, 613, 668, 723];

function Home(){

  return (
    <div className="homepage">
      {/* ── Header ── */}
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

      {/* ── Background gradient ── */}
      <div className="rectangle" />

      {/* ── Khối 1: Giới thiệu ── */}
      <div className="card-rect div" />
      <div className="frame">
        <p className="text-wrapper">BKTI là gì vậy nhỉ?</p>
      </div>
      <div className="div-wrapper">
        <p className="p">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
          rhoncus, quam vel lobortis fermentum, sem ipsum suscipit turpis,
          eleifend luctus nibh turpis et nulla. Sed luctus purus orci, vel porta
          turpis viverra ut. Sed dignissim mi eget lorem tincidunt, et iaculis
          mauris vestibulum. Morbi sit amet pellentesque turpis. Cras vulputate
          laoreet blandit. Vesti
        </p>
      </div>
      <div className="action-btn frame-3">
        <div className="text-wrapper-7">opt 1</div>
      </div>
      <div className="action-btn frame-2">
        <div className="text-wrapper-6">Bắt đầu làm bài</div>
      </div>
      <div className="action-btn frame-4">
        <div className="text-wrapper-7">opt 1</div>
      </div>

      {/* ── Khối 2: Bảng xếp hạng (trái-trên) ── */}
      <div className="card-rect rectangle-2" />
      <p className="block-title text-wrapper-8">Bảng xếp hạng</p>
      {RANKING_TOP_POSITIONS.map((top, idx) => (
        <div className="group" style={{ top: `${top}px` }} key={idx}>
          <div className="text-wrapper-9">con quỷ của nie</div>
          <div className="ranking-light-text text-wrapper-10">ai mà biết được</div>
          <div className="ranking-light-text text-wrapper-11">10/10</div>
          <div className="ellipse" />
          <div className="rectangle-7" />
        </div>
      ))}

      {/* ── Khối 3: Trái-dưới ── */}
      <div className="card-rect rectangle-3" />
      <p className="block-title text-wrapper-4">Ai biết ghi gì đâu</p>

      {/* ── Khối 4: Phải (dọc) ── */}
      <div className="card-rect rectangle-4" />
      <p className="block-title text-wrapper-2">Ai biết ghi gì đâu</p>

      {/* ── Khối 5: Full-width 1 ── */}
      <div className="card-rect rectangle-5" />
      <p className="block-title text-wrapper-3">Ai biết ghi gì đâu</p>

      {/* ── Khối 6: Full-width 2 ── */}
      <div className="card-rect rectangle-6" />
      <p className="block-title text-wrapper-5">Ai biết ghi gì đâu</p>
    </div>
  );
}

export default Home;

