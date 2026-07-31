import React from 'react';
import './navbarstyle.css';

interface NavbarProps {
  onSocialClick?: () => void;
  onLogoClick?: () => void;
  onHashtagClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSocialClick,
  onLogoClick,
  onHashtagClick
}) => {
  return (
    <header className="navbar__container_01">
      <div className="navbar__content_01">
        {/* 1. Nút Social bên trái */}
        <button 
          className="navbar__btn_01 navbar__social-btn_01" 
          onClick={onSocialClick}
          aria-label="Social Link"
        >
          <span className="navbar__text_01">@cse-multimedia</span>
        </button>

        {/* 2. Logo ở giữa */}
        <button 
          className="navbar__logo-btn_01" 
          onClick={onLogoClick}
          aria-label="BKTI Logo"
        >
          <img src="/image/cse-small.png" alt="CSE Multimedia" className="navbar__logo-img_01" />
        </button>

        {/* 3. Nút Hashtag bên phải */}
        <button 
          className="navbar__btn_01 navbar__hashtag-btn_01" 
          onClick={onHashtagClick}
          aria-label="Hashtag Link"
        >
          <span className="navbar__text_01">#BKTI</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
