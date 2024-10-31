import React, { useState } from 'react';
import Capsule from './Capsule';
import FireIcon from './FireIcon';

interface HeaderProps {
  selectedTeams: { teamA: string; teamB: string };
  time: string;
}

const Header: React.FC<HeaderProps> = ({ selectedTeams, time }) => {

    const [streak, setStreak] = useState(0); // Initial Streak

    //Function to increase streak for testing purposes
    const increaseStreak = () => {
        setStreak((prevStreak) => prevStreak + 1);
    };

  return (
    <div className="header flex justify-between items-center p-4 bg-gray-100 rounded mb-4">
      <div className = "flex items-center">
        
        {/*<FireIcon streak={streak} />*/}
        
        <Capsule text={selectedTeams.teamA} />
        <div className="h-1 w-20 bg-black" style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }}
        ></div> {/* Line aligned with capsule */}
      </div>
      
       {/* Center Timer and "Next Up" text */}
       <div className="flex flex-col items-center mx-6">
        <div className="text-8xl font-bold leading-none mt-10" style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }}
        >{time}</div>
        <div className="text-3xl font-semibold mt-2" style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }}
        >NEXT UP</div>
        
      </div>

      <div className = "flex items-center">
        <div className="h-1 w-20 bg-black" style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }}
        ></div> {/* Line aligned with capsule */}
        <Capsule text={selectedTeams.teamB} />
      </div>

      {/* Button to test streak increase - <button onClick={increaseStreak}>Increase Streak</button> */}
      
    </div>
  );
};

export default Header;