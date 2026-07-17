import shape from "/image/shape.svg";
import "./answerstyle.css";

function Answer(){
  return (
    <div className="test-page">
      {/* ── Background & Decorations ── */}
      <div className="rectangle" />
      <img className="shape-left" alt="" src={shape} />
      <img className="shape-right" alt="" src={shape} />

      {/* ── Header ── */}
      <header className="header">
        <button className="nav-frame frame-2">
          <div className="nav-text text-wrapper-8">@cse-multimedia</div>
        </button>
        <button className="nav-frame frame-3">
          <div className="nav-text text-wrapper-9">#BKTI</div>
        </button>
        <button className="nav-logo">
          <img src="/image/cse-small.png" alt="CSE Multimedia" className="nav-logo-img" />
        </button>
        <button className="nav-frame frame-4">
          <span className="nav-text text-wrapper-10">ENG/VIE</span>
        </button>
      </header>

      {/* ── Card chính ── */}
      <div className="div" />

      {/* ── User info ── */}
      <div className="user-info group-2">
        <div className="text-wrapper-3">con quỷ của nie</div>
        <div className="text-wrapper-4">ai mà biết được</div>
        <div className="ellipse" />
      </div>

      {/* ── Progress bar ── */}
      <div className="progress-bar group-3">
        <div className="text-wrapper-5">8/18 câu hỏi</div>
        <div className="rectangle-3" />
        <div className="rectangle-4" />
      </div>

      {/* ── Câu hỏi ── */}
      <div className="question-card rectangle-6" />
      <div className="question-highlight rectangle-9" />
      <div className="question-label text-wrapper-7">Câu 1</div>
      <p className="question-text lorem-ipsum-dolor-3">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
        rhoncus, quam vel lobortis fermentum,
        <br />
        sem ipsum suscipit turpis, eleifend luctus nibh turpis et nulla. Sed
        luctus purus orci,
      </p>

      {/* ── Đáp án A ── */}
      <button className="answer-btn answer-a group">
        <div className="answer-highlight rectangle-2" />
        <span className="answer-label text-wrapper">A</span>
        <p className="answer-text lorem-ipsum-dolor">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
          rhoncus, quam vel lobortis fermentum,
          <br />
          sem ipsum suscipit turpis, eleifend luctus nibh turpis et nulla. Sed
          luctus purus orci,
        </p>
      </button>

      {/* ── Đáp án B ── */}
      <button className="answer-btn answer-b group-4">
        <div className="answer-highlight rectangle-8" />
        <span className="answer-label text-wrapper-6">B</span>
        <p className="answer-text p">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
          rhoncus, quam vel lobortis fermentum,
          <br />
          sem ipsum suscipit turpis, eleifend luctus nibh turpis et nulla. Sed
          luctus purus orci,
        </p>
      </button>

      {/* ── Đáp án C ── */}
      <button className="answer-btn answer-c group-5">
        <div className="answer-highlight rectangle-8" />
        <span className="answer-label text-wrapper-6">C</span>
        <p className="answer-text lorem-ipsum-dolor-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
          rhoncus, quam vel lobortis fermentum,
          <br />
          sem ipsum suscipit turpis, eleifend luctus nibh turpis et nulla. Sed
          luctus purus orci,
        </p>
      </button>

      {/* ── Đáp án D ── */}
      <button className="answer-btn answer-d group-6">
        <div className="answer-highlight rectangle-8" />
        <span className="answer-label text-wrapper-6">D</span>
        <p className="answer-text lorem-ipsum-dolor-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
          rhoncus, quam vel lobortis fermentum,
          <br />
          sem ipsum suscipit turpis, eleifend luctus nibh turpis et nulla. Sed
          luctus purus orci,
        </p>
      </button>

      {/* ── Navigation buttons ── */}
      <button className="nav-btn div-wrapper">
        <span className="text-wrapper-2">Câu trước</span>
      </button>
      <button className="nav-btn frame">
        <span className="text-wrapper-2">Câu kế tiếp</span>
      </button>
    </div>
  );
};

export default Answer
