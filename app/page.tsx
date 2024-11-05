"use client";

import React, { useState, useEffect } from 'react';
import TeamList from './components/teamList';
import Header from './components/Header';
import ClockDisplay from './components/ClockDisplay';

export default function Home() {
  
  const [teams, setTeams] = useState<string[]>([
    "Boilermakers",
    "Pete's Footballers",
    "Choo Choo",
    "Team Spurs",
    "Chelsea Boys",
    "Academy Ballers",
    "Futbol Is Life",
    "Gunners burh"
  ]);

  const [selectedTeams, setSelectedTeams] = useState<{ teamA: string; teamB: string }>({
    teamA: teams[0],
    teamB: teams[1],
  });

  const addTeam = (newTeam: string) => {
    setTeams([...teams, newTeam]); 
  };

  useEffect(() => {
    if (teams.length > 1) {
      setSelectedTeams({ teamA: teams[0], teamB: teams[1] });
    }
  }, [teams]);
  
  return (
    <div className="main-container flex flex-col min-h-screen p-8 sm:p-20 font-[var(--font-koulen)]">
      
      <Header selectedTeams={selectedTeams} time="7:00" />

      <main className="flex flex-col gap-8 items-center justify-center sm:items-start mt-3 flex-1">
        <div className="w-full flex justify-center"> {/* Wrapper to center TeamList */}
          <TeamList teams={teams.slice(2)} />
        </div>
      </main>

      <footer className="footer">
        <ClockDisplay/>
      </footer>
    </div>
  );
}