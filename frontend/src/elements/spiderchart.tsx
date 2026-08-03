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
  },
  scales: {
    r: {
      angleLines: {
        display: true,
        color: 'rgba(0, 0, 0, 0.1)',
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
      pointLabels: {
        font: {
          family: '"Inter-SemiBold", Helvetica, Arial, sans-serif',
          size: 14,
          weight: 600,
        },
        color: '#4B5563', 
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
    labels: ['Im Lặng', 'Hay Nói', 'VibeCoder', 'Handmade', 'Chữa Lành', 'Mutant'],
    datasets: [
      {
        label: SPIDER_CHART_CONFIG.employeeName,
        data: scores,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
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