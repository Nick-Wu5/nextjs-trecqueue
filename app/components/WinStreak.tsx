import React, { useState, useEffect } from 'react';
import '../styles/WinStreak.css';

interface WinStreakProps {
  streakCount: number;
}

const WinStreak: React.FC<WinStreakProps> = ({ streakCount }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (streakCount > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300); // Reset animation
      return () => clearTimeout(timer);
    }
  }, [streakCount]);

  return (
    <div className={`win-streak ${animate ? 'animate' : ''}`}>
      <div className="fire-icon-container">
        <span className="fire-icon">🔥</span>
        <span className="streak-number">{streakCount}</span>
      </div>      
    </div>
  );
};

export default WinStreak;
