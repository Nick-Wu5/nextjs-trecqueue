import React, { useEffect, useState } from 'react';

const ClockDisplay: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update the time every second
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  // Format the time as HH:MM AM/PM
  const formattedTime = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="clock-display">
      <div className="trec-text">TREC QUEUE</div>
      <div className="time-text">{formattedTime}</div>
    </div>
  );
};

export default ClockDisplay;
