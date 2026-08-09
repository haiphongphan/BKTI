import { useState, useEffect } from "react";
import axios from "axios";
/* import shape from "/image/shape.svg"; */
import { ProgressBar } from "../elements/progressbar";
import TiltCard from "../elements/tiltcard";
import Navbar from "../elements/navbar";
import API_URL from "../api";
import TechBackground from "../elements/techbackground";
import Footer from "../elements/footer";
import Pers_popup from "./personality_popup";
import FAQ from "./FAQ";
import "./answerstyle.css";

function Answer() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 992);
  const [persPopup, setPersPopup] = useState(false);
  const [faq, setFaq] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const getQuestionFromBackend = async () => {
      try {
        const respond = await axios.get(`${API_URL}/questions`);
        setQuestions(respond.data);
      } catch (error) {
        console.error("Lỗi kết nối API lấy câu hỏi:", error);
      } finally {
        setLoading(false);
      }
    };
    getQuestionFromBackend();
  }, []);

  if (loading)
    return (
      <div style={{ padding: "50px", alignContent: "center" }}>
        Đang cập nhật câu hỏi
      </div>
    );
  if (questions.length === 0)
    return <div style={{ padding: "50px" }}>Không tìm thấy câu hỏi nào!</div>;

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isCurrentQuestionAnswered =
    !!userAnswers[currentQuestion.id.toString()];

  const answers = currentQuestion.answers || [];

  const goToPreviousQuestion = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      const payload = {
        answers: userAnswers,
      };

      // Gọi API POST nộp bài lên Backend
      const response = await axios.post(`${API_URL}/quiz/submit`, payload);

      if (response.data) {
        // Lưu kết quả tính cách vào localStorage để trang Result hiển thị
        localStorage.setItem("quiz_result", JSON.stringify(response.data));

        // Chuyển sang trang Result
        if ((window as any).navigateToResult) {
          (window as any).navigateToResult();
        }
      }
    } catch (error) {
      console.error("Lỗi khi nộp bài:", error);
      alert("Đã xảy ra lỗi hệ thống khi nộp bài, vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  const renderNavigationButtons = () => {
    return (
      <div className="nav-btn-container">
        <button
          className="nav-btn div-wrapper"
          onClick={goToPreviousQuestion}
          disabled={currentIndex === 0}
          style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
        >
          <span className="text-wrapper-2">Câu trước</span>
        </button>

        {currentIndex < totalQuestions - 1 ? (
          // Các câu hỏi bình thường
          <button
            className="nav-btn frame"
            onClick={goToNextQuestion}
            disabled={!isCurrentQuestionAnswered} // Khóa nút nếu chưa chọn đáp án
            style={{
              opacity: isCurrentQuestionAnswered ? 1 : 0.4,
              cursor: isCurrentQuestionAnswered ? "pointer" : "not-allowed",
            }}
          >
            <div
              className="text-wrapper-2"
              style={{ color: "#000", textAlign: "center", width: "100%" }}
            >
              Câu kế tiếp
            </div>
          </button>
        ) : (
          // Câu hỏi cuối
          <button
            className="nav-btn frame"
            onClick={handleSubmitQuiz}
            disabled={!isCurrentQuestionAnswered || submitting}
            style={{
              backgroundColor: isCurrentQuestionAnswered ? "#28a745" : "#ccc",
              opacity: isCurrentQuestionAnswered ? 1 : 0.4,
              cursor: isCurrentQuestionAnswered ? "pointer" : "not-allowed",
            }}
          >
            <div
              className="text-wrapper-2"
              style={{
                color: "#fff",
                textAlign: "center",
                width: "100%",
                fontWeight: "bold",
              }}
            >
              {submitting ? "Đang chấm..." : "Nộp bài làm"}
            </div>
          </button>
        )}
      </div>
    );
  };

  const handleNavClick = (
    target: "home" | "ranking" | "personality" | "faq" | "credit",
  ) => {
    if (target === "personality") {
      setPersPopup(true);
    } else if (target === "faq") {
      setFaq(true);
    } else if (target === "credit") {
      const el = document.querySelector(".footer__container_01");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="answer-page-wrapper">
      {/* ── Background Lưới công nghệ & Ký tự trôi lơ lửng ── */}
      <TechBackground />

      <Navbar onNavClick={handleNavClick} isAnswerPage={true} />

      {persPopup && (
        <div className="popup-overlay" onClick={() => setPersPopup(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <Pers_popup onClose={() => setPersPopup(false)} />
          </div>
        </div>
      )}

      {faq && (
        <div className="popup-overlay" onClick={() => setFaq(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <FAQ onClose={() => setFaq(false)} />
          </div>
        </div>
      )}

      <div className="test-page">

      {/* ── Khối giới thiệu & Hướng dẫn (Intro Block) ── */}
      <div className="quiz-intro-section">
        <div className="quiz-intro-header">
          <img
            src="/image/bkti_logo.png"
            alt="BKTI Logo"
            className="quiz-intro-logo"
          />
          <h1 className="quiz-intro-title">
            {/* EDITABLE_TEXT: Tiêu đề chính */}
            Bài kiểm tra tính cách sinh viên Bách khoa
          </h1>
          <p className="quiz-intro-subtitle">
            Khám phá bản thân, định hướng tương lai cùng BKTI
          </p>
        </div>

        <div className="quiz-steps-grid">
          {/* Bước 1 */}
          <TiltCard className="quiz-step-card step-card-blue">
            <div className="step-image-wrap">
              <img src="/image/step1.png" alt="Step 1" className="step-image" />
            </div>
            <span className="step-badge">BƯỚC 1</span>
            <h3 className="step-title">
              {/* EDITABLE_TEXT: Tiêu đề bước 1 */}
              Làm bài kiểm tra
            </h3>
            <p className="step-desc">
              {/* EDITABLE_TEXT: Mô tả bước 1 */}
              Hãy là chính mình và trả lời một cách trung thực (hoặc không, làm sao chúng tôi biết được bạn có trung thực hay không)
            </p>
          </TiltCard>

          {/* Bước 2 */}
          <TiltCard className="quiz-step-card step-card-green">
            <div className="step-image-wrap">
              <img src="/image/step2.png" alt="Step 2" className="step-image" />
            </div>
            <span className="step-badge">BƯỚC 2</span>
            <h3 className="step-title">
              {/* EDITABLE_TEXT: Tiêu đề bước 2 */}
              Xem kết quả kiểm tra
            </h3>
            <p className="step-desc">
              {/* EDITABLE_TEXT: Mô tả bước 2 */}
              Tìm ra bản thể "SV"(Sinh viên) Bách khoa của bạn, từ đó xây dựng lộ trình 4 năm (hoặc hơn) tại trường để tỏa sáng rực rỡ
            </p>
          </TiltCard>

          {/* Bước 3 */}
          <TiltCard className="quiz-step-card step-card-purple">
            <div className="step-image-wrap">
              <img src="/image/step3.png" alt="Step 3" className="step-image" />
            </div>
            <span className="step-badge">BƯỚC 3</span>
            <h3 className="step-title">
              {/* EDITABLE_TEXT: Tiêu đề bước 3 */}
              Bức phá tiềm năng của bạn
            </h3>
            <p className="step-desc">
              {/* EDITABLE_TEXT: Mô tả bước 3 */}
              Nhấn làm lại nếu bạn tin rằng có sự nhầm lẫn, hoặc chia sẻ cho bạn bè về nhân vật của bạn để mọi người trầm trồ!
            </p>
          </TiltCard>
        </div>
      </div>

      {/* ── Card chính ── */}
      <div className="main-card-wrapper">
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

          {/* ── Progress bar ── */}
          <div className="progress-bar-wrap">
            <ProgressBar current={currentIndex + 1} total={totalQuestions} />
          </div>

          {!isMobile && renderNavigationButtons()}
        </div>

        {/* --- Cụm hiển thị Đáp án --- */}
        <div className="answers-container">
          {answers.map((opt: any, index: number) => {
            const btnClassMap = [
              "answer-a group",
              "answer-b group-4",
              "answer-c group-5",
            ];
            const currentClass = btnClassMap[index] || "answer-a group";

            const currentLetter = String.fromCharCode(65 + index);

            const isSelected =
              userAnswers[currentQuestion.id.toString()] === opt.id.toString();

            return (
              <button
                key={opt.id || index}
                className={`answer-btn ${currentClass} ${isSelected ? "answer-btn--selected" : ""}`}
                onClick={() => {
                  setUserAnswers((prev) => ({
                    ...prev,
                    [currentQuestion.id.toString()]: opt.id.toString(),
                  }));
                }}
              >
                <div className="answer-highlight rectangle-2" />
                <span className="answer-label text-wrapper">
                  {currentLetter} {/* Tự sinh chữ A, B, C */}
                </span>
                <div className="answer-text lorem-ipsum-dolor">
                  {opt.content} {}
                </div>
              </button>
            );
          })}
        </div>

        {isMobile && renderNavigationButtons()}
      </div>
      </div>
      <Footer />
    </div>
  );
}

export default Answer;
