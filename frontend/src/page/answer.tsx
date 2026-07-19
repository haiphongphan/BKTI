import { useState } from "react";
import shape from "/image/shape.svg";
import { ProgressBar } from "../elements/progressbar";
import { QUESTIONS } from "../data/questions";
import { ANSWER } from "../data/answer";
import "./answerstyle.css";

function Answer(){
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = QUESTIONS[currentIndex];
  const totalQuestions = QUESTIONS.length;

  const answerA = ANSWER[currentIndex * 3];
  const answerB = ANSWER[currentIndex * 3 + 1];
  const answerC = ANSWER[currentIndex * 3 + 2];

  const goToPreviousQuestion = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }
    (window as any).navigateToResult?.();
  };

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
          <img src="/image/CSE-small.png" alt="CSE Multimedia" className="nav-logo-img" />
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
        <ProgressBar current={currentIndex + 1} total={totalQuestions} />
      </div>

      {/* ── Câu hỏi ──  */}
      <div className="question-container" key={`q-container-${currentIndex}`}>
        <div className="question-card rectangle-6" />
        <div className="question-highlight rectangle-9" />
        <div className="question-label-wrap">
          <div className="question-label text-wrapper-7">
            Câu {currentQuestion.id}
          </div>
        </div>
        <div className="question-text-wrap">
          <p className="question-text lorem-ipsum-dolor-3">
            {currentQuestion.content}
          </p>
        </div>
      </div>

      {/* ── Đáp án A  ── */}
      {answerA && (
        <button key={`ans-a-${currentIndex}`} className="answer-btn answer-a group">
          <div className="answer-highlight rectangle-2" />
          <span className="answer-label text-wrapper">A</span>
          <div className="answer-text lorem-ipsum-dolor">
              {answerA.content}
          </div>
        </button>
      )}

      {/* ── Đáp án B  ── */}
      {answerB && (
        <button key={`ans-b-${currentIndex}`} className="answer-btn answer-b group-4">
          <div className="answer-highlight rectangle-8" />
          <span className="answer-label text-wrapper-6">B</span>
          <p className="answer-text p">
            {answerB.content}
          </p>
        </button>
      )}

      {/* ── Đáp án C  ── */}
      {answerC && (
        <button key={`ans-c-${currentIndex}`} className="answer-btn answer-c group-5">
          <div className="answer-highlight rectangle-8" />
          <span className="answer-label text-wrapper-6">C</span>
          <p className="answer-text lorem-ipsum-dolor-2">
            {answerC.content}
          </p>
        </button>
      )}

      {/* ── Đáp án D ──  option bỏ*/}
      {/* <button className="answer-btn answer-d group-6">
        <div className="answer-highlight rectangle-8" />
        <span className="answer-label text-wrapper-6">D</span>
        <p className="answer-text lorem-ipsum-dolor-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
          rhoncus, quam vel lobortis fermentum,
          <br />
          sem ipsum suscipit turpis, eleifend luctus nibh turpis et nulla. Sed
          luctus purus orci,
        </p>
      </button> */}

      {/* ── Navigation buttons ── */}
      <button
        className="nav-btn div-wrapper"
        onClick={goToPreviousQuestion}
        disabled={currentIndex === 0}
      >
        <span className="text-wrapper-2">Câu trước</span>
      </button>
      <button className="nav-btn frame" onClick={goToNextQuestion}>
        <span className="text-wrapper-2">Câu kế tiếp</span>
      </button>
    </div>
  );
};

export default Answer
