import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './page/home.tsx'
import Answer from './page/answer.tsx'
import Result from './page/result.tsx'

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'answer' | 'result'>('home')
  const [showPopup, setShowPopUp] = useState<boolean>(true)

  useEffect(() => {
    // Điều hướng toàn cục 
    (window as any).navigateToResult = () => {
      setCurrentPage('result');
    };
    (window as any).navigateToHome = () => {
      setCurrentPage('home');
      setShowPopUp(false); // Không tự động hiện lại popup
    };
    (window as any).navigateToAnswer = () => {
      setCurrentPage('answer');
    }
    return () => {
      delete (window as any).navigateToResult;
      delete (window as any).navigateToHome;
      delete (window as any).navigateToAnswer;
    };
  }, []);

  const renderContent = () => {
    if (currentPage === 'home') {
      return (
        <Home 
          showPopup={showPopup}
          onClosePopup={() => setShowPopUp(false)}
          onStartQuiz={() => setCurrentPage('answer')} 
        />
      );
    }

    if (currentPage === 'answer') {
      return <Answer />;
    }

    return <Result />;
  };

  return renderContent();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)
