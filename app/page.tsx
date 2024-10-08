"use client";

import React, { useState } from 'react';
import TeamList from './components/teamList';

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

  const addTeam = (newTeam: string) => {
    setTeams([...teams, newTeam]); // Update the teams state
  };
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[var(--font-koulen)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <TeamList teams={teams} /> {/* Use TeamList component to render teams */}
        <button onClick={() => addTeam('New Team')}>Add Team</button>
      </main>
    </div>
  );
}
