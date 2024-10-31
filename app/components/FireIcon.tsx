"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import './FireIcon.css'; // Create a CSS file for the animation styles

interface FireIconProps {
  streak: number;
}

const FireIcon: React.FC<FireIconProps> = ({ streak }) => {
  const [prevStreak, setPrevStreak] = useState(streak);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (streak > prevStreak) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 500); // Remove animation class after animation duration
    }
    setPrevStreak(streak);
  }, [streak, prevStreak]);

  return (
    <div className="fire-icon-wrapper relative">
      {/* Fire SVG Icon */}
      <Image src="/fireIcon.svg" alt="Fire Icon" width={75} height={75} />

      {/* Streak number overlay */}
      <div className={`streak-number ${animate ? 'animate' : ''}`}>
        {streak}
      </div>
    </div>
  );
};

export default FireIcon;
