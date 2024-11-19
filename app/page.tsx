"use client";

import React, { useState, useEffect } from "react";
import TeamList from "./components/teamList";
import Header from "./components/Header";
import ClockDisplay from "./components/ClockDisplay";

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<{ teamA: string; teamB: string }>({
    teamA: "",
    teamB: "",
  });

  // Fetch teams from the backend
  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams");
      if (!response.ok) {
        console.error("Error fetching teams:", response.statusText);
        return;
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setTeams(data);
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    }
  };

  // Fetch teams on component mount and set interval
  useEffect(() => {
    fetchTeams();
    const intervalId = setInterval(fetchTeams, 5000); // Fetch every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  // Update selected teams when teams change
  useEffect(() => {
    if (teams.length > 1) {
      setSelectedTeams({ teamA: teams[0].teamName, teamB: teams[1].teamName });
    }
  }, [teams]);

  const mainListTeams = teams.slice(2, 7).map((team) => team.teamName);
  const additionalTeamsCount = teams.length - 7;

  return (
    <div className="main-container flex flex-col min-h-screen p-5 sm:p-20">
      <Header selectedTeams={selectedTeams} time="7:00" teamAStreak={0} />
      <main className="flex items-center flex-1">
        <div className="left-section">
          <img src="/purduePete.png" alt="Purdue Pete" className="footer-image-left" />
          <ClockDisplay />
        </div>
        <div className="team-list-container flex flex-col items-center">
          <TeamList teams={mainListTeams} additionalTeamsCount={additionalTeamsCount} />
        </div>
        <div className="right-section">
          <img src="/PurdueRecLogo.png" alt="Purdue Rec Logo" className="footer-image-right" />
        </div>
      </main>
    </div>
  );
}