import React from 'react';
import './progresbar.css';

interface ProgressBarProps {
  current: number; // Số câu hiện tại
  total: number;   // Tổng số câu
  showText?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, showText = true }) => {
  // Tính tỷ lệ
  const percentage = Math.min(Math.max((current / total) * 100, 0), 100);

  return (
    <div className="progress-container">
      {/* Phần chữ hiển thị */}
      {showText && (
      <div className="progress-text">
        {current}/{total} câu hỏi
      </div>
      )}
      {/* Thanh nền xám */}
      <div className="progress-track">
        {/* Thanh tiến trình*/}
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};