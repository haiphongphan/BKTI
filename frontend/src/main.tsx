import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './page/home.tsx'
import Answer from './page/answer.tsx'

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'answer'>('home')
  const [showPopup, setShowPopUp] = useState<boolean>(false)

  if(currentPage == 'home') {
    return (
      <Home 
        showPopup = {showPopup}
        onClosePopup = {() => setShowPopUp(false)}
        onStartQuiz = {() => setCurrentPage('answer')} 
      />
    );
  }
  return (<Answer />);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
