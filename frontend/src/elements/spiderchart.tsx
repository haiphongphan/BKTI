import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, type ChartData, type ChartOptions } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import "./spiderstyle.css";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const SPIDER_CHART_CONFIG = {
  employeeName: 'Tỉ lệ',       // Thay đổi tên
};

const options: ChartOptions<'radar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false, // Ẩn nhãn
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(30, 21, 72, 0.95)', // Màu tím đậm thương hiệu
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      titleFont: {
        family: 'Inter, sans-serif',
        size: 14,
        weight: 'bold',
      },
      bodyFont: {
        family: 'Inter, sans-serif',
        size: 13,
        weight: 'normal',
      },
      padding: 12,
      cornerRadius: 12,
      displayColors: false, // Ẩn biểu tượng màu
      borderWidth: 1,
      borderColor: 'rgba(153, 143, 199, 0.3)',
      callbacks: {
        title: (tooltipItems: any) => {
          return tooltipItems[0].label; // Tên thuộc tính làm tiêu đề
        },
        label: (context: any) => {
          return ` Tỉ lệ: ${Math.round(context.raw)}%`; // Giá trị phần trăm làm tròn
        }
      }
    }
  },
  scales: {
    r: {
      angleLines: {
        display: true,
        color: 'rgba(153, 143, 199, 0.25)', // Tím nhạt đồng bộ
      },
      grid: {
        color: 'rgba(153, 143, 199, 0.15)', // Tím nhạt đồng bộ
      },
      pointLabels: {
        font: {
          family: '"Inter", Helvetica, Arial, sans-serif',
          size: 13,
          weight: 700,
        },
        color: '#1e1548', // Màu tím thẫm thương hiệu
      },
      ticks: {
        display: false, // Ẩn các số thang đo
      },
      suggestedMin: 0,
      suggestedMax: 100,
    },
  },
};

interface ChartProps {
  scores?: number[];
}

export const Chart: React.FC<ChartProps> = ({ scores = [0, 0, 0, 0, 0, 0] }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const chartData: ChartData<'radar'> = {
    labels: ['Im Lặng', 'VibeCoder', 'Chữa Lành', 'Hay Nói', 'Handmade', 'Mutant'],
    datasets: [
      {
        label: SPIDER_CHART_CONFIG.employeeName,
        data: scores,
        backgroundColor: 'rgba(124, 65, 231, 0.15)', // Màu nền tím nhạt đồng bộ thương hiệu
        borderColor: '#7c41e7', // Màu viền tím đậm thương hiệu
        borderWidth: 3, // Viền dày hơn trông xịn hơn
        pointBackgroundColor: '#ffffff', // Các điểm có nền trắng
        pointBorderColor: '#7c41e7', // Viền điểm màu tím
        pointBorderWidth: 2,
        pointRadius: 4, // Điểm to vừa phải để dễ hover
        pointHoverBackgroundColor: '#7c41e7', // Khi hover điểm đổi thành tím
        pointHoverBorderColor: '#ffffff', // Viền hover màu trắng
        pointHoverBorderWidth: 2,
        pointHoverRadius: 7, // Phóng to điểm khi hover để tạo micro-animation
      },
    ],
  };

  return (
    <div 
      ref={containerRef} 
      className={`spider-chart-wrapper ${isVisible ? 'fade-in' : ''}`}
    >
      {isVisible && <Radar data={chartData} options={options} />}
    </div>
  );
};