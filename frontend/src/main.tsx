import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './page/home.tsx'
import Answer from './page/answer.tsx'
import Result from './page/result.tsx'

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'answer' | 'result'>('home')
  const [displayPage, setDisplayPage] = useState<'home' | 'answer' | 'result'>('home')
  const [showPopup, setShowPopUp] = useState<boolean>(true)
  const [fadeState, setFadeState] = useState<'fade-in' | 'fade-out'>('fade-in')

  const transitionToPage = (newPage: 'home' | 'answer' | 'result') => {
    setFadeState('fade-out');
    setTimeout(() => {
      setDisplayPage(newPage);
      setCurrentPage(newPage);
      setFadeState('fade-in');
      window.scrollTo(0, 0); // Đảm bảo cuộn lên đầu trang ở thời điểm mờ đi
    }, 250); // thời gian khớp với transition của CSS (0.25s)
  };

  useEffect(() => {
    // Điều hướng toàn cục 
    (window as any).navigateToResult = () => {
      transitionToPage('result');
    };
    (window as any).navigateToHome = () => {
      transitionToPage('home');
      setShowPopUp(false); // Không tự động hiện lại popup
    };
    (window as any).navigateToAnswer = () => {
      transitionToPage('answer');
    }
    return () => {
      delete (window as any).navigateToResult;
      delete (window as any).navigateToHome;
      delete (window as any).navigateToAnswer;
    };
  }, []);

  const renderContent = () => {
    if (displayPage === 'home') {
      return (
        <Home 
          showPopup={showPopup}
          onClosePopup={() => setShowPopUp(false)}
          onStartQuiz={() => transitionToPage('answer')} 
        />
      );
    }

    if (displayPage === 'answer') {
      return <Answer />;
    }

    return <Result />;
  };

  return (
    <div className={`page-transition-container ${fadeState}`}>
      {renderContent()}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)
