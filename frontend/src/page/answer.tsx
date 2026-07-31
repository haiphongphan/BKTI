import { useState, useEffect } from "react";
import axios from "axios";
/* import shape from "/image/shape.svg"; */
import { ProgressBar } from "../elements/progressbar";
import "./answerstyle.css";


function Answer(){
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 992);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
  const isCurrentQuestionAnswered = !!userAnswers[currentQuestion.id.toString()];

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
        answers: userAnswers
      }; 

      // Gọi API POST nộp bài lên Backend
      const response = await axios.post("http://127.0.0.1:8000/quiz/submit", payload);

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
              cursor: isCurrentQuestionAnswered ? 'pointer' : 'not-allowed'
            }}
          >
            <div className="text-wrapper-2" style={{ color: '#000', textAlign: 'center', width: '100%' }}>
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
              backgroundColor: isCurrentQuestionAnswered ? '#28a745' : '#ccc',
              opacity: isCurrentQuestionAnswered ? 1 : 0.4,
              cursor: isCurrentQuestionAnswered ? 'pointer' : 'not-allowed'
            }}
          >
            <div className="text-wrapper-2" style={{ color: '#fff', textAlign: 'center', width: '100%', fontWeight: 'bold' }}>
              {submitting ? "Đang chấm..." : "Nộp bài làm"}
            </div>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="test-page">
      {/* ── Background & Decorations ── */}
      <div className="rectangle" />

      {/* ── Header ── */}
      <header className="header">
        <button className="nav-frame frame-2">
          <div className="nav-text text-wrapper-8">@cse-multimedia</div>
        </button>
        <button className="nav-logo" onClick={() => (window as any).navigateToHome?.()}>
          <img src="/image/cse-small.png" alt="CSE Multimedia" className="nav-logo-img" />
        </button>
        <button className="nav-frame frame-3">
          <div className="nav-text text-wrapper-9">#BKTI</div>
        </button>
      </header>

      {/* ── Card chính ── */}
      <div className="div" />
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
          const btnClassMap = ["answer-a group", "answer-b group-4", "answer-c group-5"];
          const currentClass = btnClassMap[index] || "answer-a group";

          const currentLetter = String.fromCharCode(65 + index);

          const isSelected = userAnswers[currentQuestion.id.toString()] === opt.id.toString();


          return (
            <button key={opt.id || index} className={`answer-btn ${currentClass}`}
            onClick={() => {
              setUserAnswers(prev => ({
                ...prev,
                [currentQuestion.id.toString()]: opt.id.toString()
              }));
            }}
            >
              <div 
                className="answer-highlight rectangle-2" 
                style={isSelected ? { backgroundColor: '#bb9fe0', border: '2px solid #6f42c1' } : {}}
              />
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
      </div>{/* === KẾT THÚC main-card-wrapper === */}
    </div>
  );
};

export default Answer;