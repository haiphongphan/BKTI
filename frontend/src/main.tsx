import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
/* import Home from './page/home.tsx' */
/* import Popup from './page/popup.tsx' */
import Answer from './page/answer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Home/> */}
    {/* <Popup/> */}
    <Answer/>
  </StrictMode>,
)
