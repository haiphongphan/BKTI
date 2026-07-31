import React from 'react';
import './footerstyle.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer__container_01">
      <div className="footer__content_01">
        <div className="footer__info_01">
          <div className="footer__brand_01">
            <span className="footer__logo-text_01">BKTI</span>
            <span className="footer__tagline_01"> - Bach Khoa Type Indicator</span>
          </div>
          <p className="footer__description_01">
            Bài trắc nghiệm tính cách châm biếm dành riêng cho sinh viên Bách khoa.
          </p>
        </div>
        <div className="footer__meta_01">
          <p className="footer__text_01">
            Sản phẩm được thực hiện bởi <strong>Ban Truyền thông khoa Khoa học và Kỹ thuật Máy tính (BTT)</strong>.
          </p>
          <div className="footer__links_01">
            <a 
              href="https://www.facebook.com/cse.multimedia" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer__link_01"
            >
              Fanpage CSE Multimedia
            </a>
            <span className="footer__separator_01">|</span>
            <span className="footer__copyright_01">
              © {new Date().getFullYear()} BTT. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
