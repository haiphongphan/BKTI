import React, { useState, useRef } from 'react';
import './navbarstyle.css';

interface NavbarProps {
  onNavClick: (target: 'home' | 'ranking' | 'personality' | 'faq' | 'credit') => void;
  activeItem?: 'home' | 'ranking' | 'personality' | 'faq' | 'credit';
  isAnswerPage?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavClick, activeItem, isAnswerPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCseClick = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount === 11) {
      setClickCount(0);
      const secretPersonality = {
        code: "NSFW",
        name: "Nhà thám hiểm vĩ đại",
        description:
          'Chúc mừng! Bạn đã chính thức đi chệch khỏi kịch bản và tìm ra Easter Egg giấu kín của hệ thống. Trong khi những người bình thường ngoan ngoãn điền từng câu trắc nghiệm để nhận kết quả, thì bạn lại chọn cách... "test nhân phẩm" của cả cái website này. Với đôi tay không biết mỏi, bản tính tò mò vô cực và khả năng thao tác vặn vẹo mọi luồng UX/UI thông thường, bạn không đi tìm bản ngã của mình, bạn đi tìm... bug. Hệ thống xin đầu hàng trước bạn. Có thể bạn là một pháp sư chuyên mở F12 để soi code, một QA Tester bẩm sinh, hoặc đơn giản là bạn quá rảnh và thích click lung tung khắp màn hình. Dù lý do là gì, tư duy out trình và không chịu gò bó vào khuôn khổ đã biến bạn thành một Nhà thám hiểm vĩ đại thực thụ. Bách khoa rất cần những bộ óc thích khám phá như bạn để tạo ra những đột phá mới (hoặc làm sập server lúc đăng ký môn, tùy tâm trạng). Tóm lại, bạn không thuộc về bất kỳ nhóm tính cách nào ở trên. Xin nhận của team Developer một lạy!',
        image_url: "/image/mochi/Nha_tham_hiem.webp",
        music_url: "/music/Nha_tham_hiem.mp3",
        dimension1_nguoi_im_lang: 67,
        dimension1_nguoi_hay_noi: 33,
        dimension2_vibecoder: 36,
        dimension2_handmade: 64,
        dimension3_chua_lanh: 26,
        dimension3_mutant: 71
      };

      localStorage.setItem("quiz_result", JSON.stringify(secretPersonality));
      if ((window as any).navigateToResult) {
        (window as any).navigateToResult();
      }
    } else {
      timerRef.current = setTimeout(() => {
        setClickCount(0);
      }, 1000);
    }
  };

  const navItems = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'ranking', label: 'Bảng xếp hạng' },
    { id: 'personality', label: 'Các kiểu tính cách' },
    { id: 'faq', label: 'FAQ' },
    { id: 'credit', label: 'Credit' }
  ] as const;

  const handleItemClick = (id: 'home' | 'ranking' | 'personality' | 'faq' | 'credit') => {
    // Ngăn chặn chuyển hướng trang chủ/bảng xếp hạng khi đang ở trang làm bài
    if (isAnswerPage && (id === 'home' || id === 'ranking')) {
      return;
    }
    onNavClick(id);
    setIsOpen(false); // Đóng menu mobile drawer
  };

  return (
    <nav className="bkti-navbar">
      <div className="bkti-navbar__container">
        {/* Khối Logo & CSE bên trái */}
        <div className="bkti-navbar__logo-area">
          <div 
            className="bkti-navbar__logo" 
            style={isAnswerPage ? { cursor: 'default', pointerEvents: 'none' } : {}}
            onClick={isAnswerPage ? undefined : () => handleItemClick('home')}
          >
            <img src="/image/bkti_logo.webp" alt="BKTI Logo" className="bkti-navbar__logo-img" />
            <div className="bkti-navbar__logo-text-group">
              <span className="bkti-navbar__logo-title">BKTI</span>
              <span className="bkti-navbar__logo-subtitle">Bach Khoa Type Indicator</span>
            </div>
          </div>

          {/* Nút CSE logo kích hoạt Easter Egg */}
          <button className="bkti-navbar__cse-btn" onClick={handleCseClick} aria-label="CSE Multimedia">
            <img src="../../image/cse-small.webp" alt="CSE Logo" className="bkti-navbar__cse-img" />
          </button>
        </div>

        {/* Menu giữa cho Desktop */}
        <div className="bkti-navbar__menu">
          {navItems.map((item) => {
            const isDisabled = isAnswerPage && (item.id === 'home' || item.id === 'ranking');
            return (
              <button
                key={item.id}
                className={`bkti-navbar__link ${activeItem === item.id ? 'bkti-navbar__link--active' : ''} ${isDisabled ? 'bkti-navbar__link--disabled' : ''}`}
                onClick={isDisabled ? undefined : () => handleItemClick(item.id)}
                disabled={isDisabled}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Burger Icon cho Mobile */}
        <button 
          className={`bkti-navbar__burger ${isOpen ? 'bkti-navbar__burger--open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className="bkti-navbar__burger-line"></span>
          <span className="bkti-navbar__burger-line"></span>
          <span className="bkti-navbar__burger-line"></span>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`bkti-navbar__mobile-menu ${isOpen ? 'bkti-navbar__mobile-menu--open' : ''}`}>
        {navItems.map((item) => {
          const isDisabled = isAnswerPage && (item.id === 'home' || item.id === 'ranking');
          return (
            <button
              key={item.id}
              className={`bkti-navbar__mobile-link ${activeItem === item.id ? 'bkti-navbar__mobile-link--active' : ''} ${isDisabled ? 'bkti-navbar__mobile-link--disabled' : ''}`}
              onClick={isDisabled ? undefined : () => handleItemClick(item.id)}
              disabled={isDisabled}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
