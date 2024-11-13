"use client";

import React, { useState, useEffect } from 'react';
import TeamList from './components/teamList';
import Header from './components/Header';
import ClockDisplay from './components/ClockDisplay';

export default function Home() {
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<{ teamA: string; teamB: string }>({
    teamA: '',
    teamB: '',
  });
  
  // Fetch team data from the API
  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      if (!response.ok) {
        console.error('Error fetching teams:', response.statusText);
        return;
      }
      const data: Team[] = await response.json();
      if (Array.isArray(data)) {
        setTeams(data);
      } else {
        console.error('Fetched data is not an array:', data);
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  };

  useEffect(() => {
    fetchTeams();
    const intervalId = setInterval(fetchTeams, 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (teams.length > 1) {
      setSelectedTeams({ teamA: teams[0].name, teamB: teams[1].name });
    }
  }, [teams]);

  // Get the next 4 teams for the main list
  const mainListTeams = teams.slice(2, 7).map((team) => team.name);
  const additionalTeamsCount = teams.length - 7;
  
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