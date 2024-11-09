import React from 'react';
import Capsule from './Capsule';
import WinStreak from './WinStreak';

interface HeaderProps {
  selectedTeams: { teamA: string; teamB: string };
  time: string;
}

const Header: React.FC<HeaderProps> = ({ selectedTeams, time }) => {
  return (
    <div className="header flex justify-center items-center w-full bg-gray-100 rounded mb-0 mt-0">
      {/* Wrapper for left capsule and line */}
      <div className="flex items-center mr-4 relative">
        <WinStreak streakCount={3}/>
        <Capsule text={selectedTeams.teamA} />
        <div
          className="h-1 w-20 bg-black ml-2"
          style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }}
        ></div>
      </div>

      {/* Centered Timer and "Next Up" text */}
      <div className="flex flex-col items-center mx-6">
        <div
          className="text-8xl font-bold leading-none"
          style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }}
        >
          {time}
        </div>
        <div
          className="text-3xl font-semibold mt-2"
          style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }}
        >
          NEXT UP
        </div>
      </div>

      {/* Wrapper for right line and capsule */}
      <div className="flex items-center ml-4">
        <div
          className="h-1 w-20 bg-black mr-2"
          style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }}
        ></div>
        <Capsule text={selectedTeams.teamB} />
      </div>
    </div>
  );
};

export default Header;