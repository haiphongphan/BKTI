import React, { useRef, useState } from "react";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Độ nghiêng tối đa (độ)
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = "",
  maxTilt = 8, // Độ nghiêng vừa phải để tinh tế và đẹp mắt
  style: customStyle,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)",
    transition: "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    // Không kích hoạt trên màn hình di động/tablet nhỏ (width <= 768px)
    if (window.innerWidth <= 768) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // Tọa độ X của chuột so với thẻ
    const y = e.clientY - rect.top;  // Tọa độ Y của chuột so với thẻ

    // Chuẩn hóa vị trí chuột từ -0.5 đến 0.5
    const normalizedX = (x / rect.width) - 0.5;
    const normalizedY = (y / rect.height) - 0.5;

    // Tính toán góc xoay (rotate)
    const rotateX = -normalizedY * maxTilt;
    const rotateY = normalizedX * maxTilt;

    // Giữ tịnh tiến cố định (chỉ nhấc lên -8px), bỏ dịch chuyển động 
    // để tránh làm lệch tâm/trượt nút bấm khỏi con trỏ chuột khi người dùng click nhanh
    const translateX = 0;
    const translateY = -8;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(${translateX}px, ${translateY}px, 15px)`,
      boxShadow: "0 22px 42px rgba(153, 143, 199, 0.32)",
      transition: "transform 0.1s ease-out, box-shadow 0.1s ease-out", // Tăng tốc độ phản hồi cực nhạy
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)",
      boxShadow: "",
      transition: "transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)", // reset êm dịu
    });
  };

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...customStyle,
        ...style,
        transformStyle: "preserve-3d",
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default TiltCard;
