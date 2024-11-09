"use client";

import React, { useState, useEffect } from 'react';
import TeamList from './components/teamList';
import Header from './components/Header';
import ClockDisplay from './components/ClockDisplay';

export default function Home() {
  
  const [teams] = useState<string[]>([
    "Oil Money FC",
    "Pete's Footballers",
    "Spurs",
    "Gunners",
    "Chelsea Boys",
    "Academy Ballers",
    "Futbol Is Life",
    "Coach is Right",

  ]);

  const [selectedTeams, setSelectedTeams] = useState<{ teamA: string; teamB: string }>({
    teamA: teams[0],
    teamB: teams[1],
  });

  // Get the next 4 teams for the main list
  const mainListTeams = teams.slice(2, 7);
  const additionalTeamsCount = teams.length - 7;

  useEffect(() => {
    if (teams.length > 1) {
      setSelectedTeams({ teamA: teams[0], teamB: teams[1] });
    }
  }, [teams]);
  
  return (
    <div className="main-container flex flex-col min-h-screen pt-0 p-5 sm:p-20 font-[var(--font-koulen)]" style={{paddingTop : "50px"}}>
      
      <Header selectedTeams={selectedTeams} time="7:00" />

      <main className="flex items-center flex-1">
        {/* Left-aligned ClockDisplay, "TREC QUEUE" text, and Pete image */}
        <div className="left-section">
          <div className="flex flex-col items-center">
            <img src="/purduePete.png" alt="Purdue Pete" className="footer-image-left" />
            <ClockDisplay />
          </div>
        </div>

        {/* Center-aligned TeamList */}
        <div className="team-list-container flex flex-col items-center">
          <TeamList teams={mainListTeams} additionalTeamsCount={additionalTeamsCount} />
        </div>

        {/* Right-aligned Purdue Rec logo */}
        <div className="right-section">
          <img src="/PurdueRecLogo.png" alt="Purdue Rec Logo" className="footer-image-right" />
        </div>
      </main>
    </div>
  );
}