import React from "react";
import "./dualbarstyle.css";

interface DualBarProps {
  leftLabel: string;
  rightLabel: string;
  leftValue: number;
  rightValue: number;
}

/**
 * DualBar — Thanh stats 2 đầu đối lập.
 * Hiển thị 1 chiều tâm lý dưới dạng 1 thanh chia đôi.
 * Bên trội hơn có màu tím (accent), bên ít hơn có màu xám.
 */
export const DualBar: React.FC<DualBarProps> = ({
  leftLabel,
  rightLabel,
  leftValue,
  rightValue,
}) => {
  const total = leftValue + rightValue;
  const leftPercent = total > 0 ? Math.round((leftValue / total) * 100) : 50;
  const rightPercent = 100 - leftPercent;

  const leftDominant = leftValue >= rightValue;

  return (
    <div className="dualbar" data-component="DualBar">
      {/* Labels row */}
      <div className="dualbar__labels">
        <span
          className={`dualbar__label ${leftDominant ? "dualbar__label--dominant" : ""}`}
        >
          {leftLabel}
        </span>
        <span
          className={`dualbar__label ${!leftDominant ? "dualbar__label--dominant" : ""}`}
        >
          {rightLabel}
        </span>
      </div>

      {/* Bar */}
      <div className="dualbar__track">
        <div
          className={`dualbar__fill dualbar__fill--left ${leftDominant ? "dualbar__fill--accent" : "dualbar__fill--muted"}`}
          style={{ width: `${leftPercent}%` }}
        />
        <div
          className={`dualbar__fill dualbar__fill--right ${!leftDominant ? "dualbar__fill--accent" : "dualbar__fill--muted"}`}
          style={{ width: `${rightPercent}%` }}
        />
      </div>

      {/* Values row */}
      <div className="dualbar__values">
        <span
          className={`dualbar__value ${leftDominant ? "dualbar__value--dominant" : ""}`}
        >
          {Math.round(leftValue)}%
        </span>
        <span
          className={`dualbar__value ${!leftDominant ? "dualbar__value--dominant" : ""}`}
        >
          {Math.round(rightValue)}%
        </span>
      </div>
    </div>
  );
};
