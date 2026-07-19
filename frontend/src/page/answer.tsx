import { useState, useEffect } from "react";
import axios from "axios";
import shape from "/image/shape.svg";
import { ProgressBar } from "../elements/progressbar";
import "./answerstyle.css";

function Answer(){
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true)
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  useEffect(()=> {
    const getQuestionFromBackend = async () => {
      try {
        const respond = await axios.get("http://127.0.0.1:8000/questions");
        setQuestions(respond.data);
      } catch (error) {
        console.error("Lỗi kết nối API lấy câu hỏi:", error);
      } finally {
        setLoading(false);
      }
    };
    getQuestionFromBackend();
  },[])

  if (loading) return <div style={{ padding: "50px", alignContent: "center" }}>Đang cập nhật câu hỏi</div>;
  if (questions.length === 0) return <div style={{ padding: "50px" }}>Không tìm thấy câu hỏi nào!</div>;

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const answers = currentQuestion.answers || [];

  const goToPreviousQuestion = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }
    // Thêm nút chuyển kết quả
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
            Câu {currentIndex + 1}
          </div>
        </div>
        <div className="question-text-wrap">
          <p className="question-text lorem-ipsum-dolor-3">
            {currentQuestion.content}
          </p>
        </div>
      </div>

      {/* --- Cụm hiển thị Đáp án --- */}
      <div className="answers-container">
        {answers.map((opt: any, index: number) => {
          // Giữ nguyên cách map class CSS của Figma
          const btnClassMap = ["answer-a group", "answer-b group-4", "answer-c group-5"];
          const currentClass = btnClassMap[index] || "answer-a group";

          const isSelected = userAnswers[currentQuestion.id.toString()] === opt.id;

          return (
            <button key={index} className={`answer-btn ${currentClass}`}
            onClick={() => {
              setUserAnswers(prev => ({
                ...prev,
                [currentQuestion.id.toString()]: opt.id
              }));
            }}
            >
              <div 
                className="answer-highlight rectangle-2" 
                style={isSelected ? { backgroundColor: '#bb9fe0', border: '2px solid #6f42c1' } : {}}
              />
              <span className="answer-label text-wrapper">
                {String.fromCharCode(65 + index)} {/* Tự sinh chữ A, B, C */}
              </span>
              <div className="answer-text lorem-ipsum-dolor">
                {opt.content} {}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Đáp án A  ──
      {answerA && (
        <button key={`ans-a-${currentIndex}`} className="answer-btn answer-a group">
          <div className="answer-highlight rectangle-2" />
          <span className="answer-label text-wrapper">A</span>
          <div className="answer-text lorem-ipsum-dolor">
              {answerA.content}
          </div>
        </button>
      )} */}

      {/* ── Đáp án B  ──
      {answerB && (
        <button key={`ans-b-${currentIndex}`} className="answer-btn answer-b group-4">
          <div className="answer-highlight rectangle-8" />
          <span className="answer-label text-wrapper-6">B</span>
          <p className="answer-text p">
            {answerB.content}
          </p>
        </button>
      )} */}

      {/* ── Đáp án C  ──
      {answerC && (
        <button key={`ans-c-${currentIndex}`} className="answer-btn answer-c group-5">
          <div className="answer-highlight rectangle-8" />
          <span className="answer-label text-wrapper-6">C</span>
          <p className="answer-text lorem-ipsum-dolor-2">
            {answerC.content}
          </p>
        </button>
      )} */}

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

      {/* ── Điều hướng câu hỏi ── */}
      <button className="nav-btn div-wrapper" onClick={goToPreviousQuestion} disabled={currentIndex === 0}>
        <span className="text-wrapper-2">Câu trước</span>
      </button>
      <button className="nav-btn frame" onClick={goToNextQuestion}>
        <span className="text-wrapper-2">Câu kế tiếp</span>
      </button>
    </div>
  );
};

export default Answer;
