import React from 'react';
import './techbackground.css';

interface Particle {
  text: string;
  size: string;
  top: string;
  left: string;
  delay: string;
  duration: string;
}

const PARTICLES: Particle[] = [
  { text: "Σ", size: "28px", top: "12%", left: "8%", delay: "0s", duration: "18s" },
  { text: "{ }", size: "24px", top: "25%", left: "15%", delay: "2s", duration: "22s" },
  { text: "π", size: "20px", top: "75%", left: "10%", delay: "1s", duration: "16s" },
  { text: "E", size: "36px", top: "85%", left: "22%", delay: "3s", duration: "24s" },
  { text: "I", size: "32px", top: "18%", left: "82%", delay: "0.5s", duration: "20s" },
  { text: "∫", size: "30px", top: "35%", left: "88%", delay: "4s", duration: "26s" },
  { text: "01", size: "22px", top: "60%", left: "90%", delay: "1.5s", duration: "17s" },
  { text: "N", size: "34px", top: "72%", left: "80%", delay: "2.5s", duration: "23s" },
  { text: "f(x)", size: "20px", top: "48%", left: "5%", delay: "3.5s", duration: "21s" },
  { text: "T", size: "36px", top: "15%", left: "45%", delay: "0.8s", duration: "19s" },
  { text: "F", size: "32px", top: "88%", left: "55%", delay: "5s", duration: "25s" },
  { text: "√", size: "26px", top: "50%", left: "95%", delay: "2.2s", duration: "18s" },
  { text: "< />", size: "22px", top: "5%", left: "25%", delay: "1.2s", duration: "20s" },
  { text: "J", size: "34px", top: "65%", left: "18%", delay: "4.5s", duration: "22s" },
  { text: "P", size: "32px", top: "92%", left: "38%", delay: "3s", duration: "27s" },
  { text: "10", size: "22px", top: "40%", left: "30%", delay: "0.2s", duration: "19s" },
];

export const TechBackground: React.FC = () => {
  return (
    <div className="tech-background-wrapper">
      <div className="tech-background-grid" />
      <div className="tech-background-particles">
        {PARTICLES.map((p, idx) => (
          <span
            key={idx}
            className="floating-particle"
            style={{
              fontSize: p.size,
              top: p.top,
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          >
            {p.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TechBackground;
