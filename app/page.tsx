"use client";

import React, { useState, useEffect } from 'react';
import TeamList from './components/teamList';
import Header from './components/Header';

export default function Home() {
  
  //Create state to hold the teams
  const [teams, setTeams] = useState<string[]>([
    "Boilermakers",
    "Pete's Footballers",
    "Choo Choo",
    "Team Spurs",
    "Chelsea Boys",
    "Academy Ballers",
    "Futbol Is Life",
  ]);

  // Create state to hold the selected teams for the header
  const [selectedTeams, setSelectedTeams] = useState<{ teamA: string; teamB: string }>({
    teamA: teams[0],
    teamB: teams[1],
  });

  const addTeam = (newTeam: string) => {
    setTeams([...teams, newTeam]); // Update the teams state
  };

  // Update selectedTeams whenever the teams array changes
  useEffect(() => {
    if (teams.length > 1) {
      setSelectedTeams({ teamA: teams[0], teamB: teams[1] });
    }
  }, [teams]);
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[var(--font-koulen)]">
      
      <Header selectedTeams={selectedTeams} time ="7:00" />

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start mt-3">
        <TeamList teams={teams.slice(2)} /> {/* Use TeamList component to render teams */}
        <button onClick={() => addTeam('New Team')}>Add Team</button>
      </main>
    </div>
  );
}
