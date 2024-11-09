// app/control/page.tsx
"use client";

import React, { useState } from 'react';

const ControlPage: React.FC = () => {
  const [teamName, setTeamName] = useState('');
  const [teamPassword, setTeamPassword] = useState('');
  const [removeTeamId, setRemoveTeamId] = useState('');
  const [removePassword, setRemovePassword] = useState('');

  const handleCreateTeam = async () => {
    if (!/^\d{4}$/.test(teamPassword)) {
      alert('Password must be a four-digit number');
      return;
    }

    await fetch('/api/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: teamName, password: teamPassword }),
    });

    setTeamName('');
    setTeamPassword('');
  };

  const handleRemoveTeam = async () => {
    if (!removeTeamId || !removePassword) {
      alert('Please enter both team ID and password');
      return;
    }

    const response = await fetch(`/api/team/${removeTeamId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: removePassword }),
    });

    if (response.ok) {
      alert('Team removed successfully');
    } else {
      const data = await response.json();
      alert(data.error || 'Failed to remove team');
    }

    setRemoveTeamId('');
    setRemovePassword('');
  };

  const handleStartNewGame = async () => {
    await fetch('/api/game/start', {
      method: 'POST',
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-10">Control Dashboard</h1>

      {/* Create Team Section */}
      <div className="mb-10 p-6 bg-white rounded shadow-lg w-1/2 max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Create Team</h2>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter team name"
          className="w-full p-3 mb-4 border rounded text-lg"
        />
        <input
          type="text"
          value={teamPassword}
          onChange={(e) => setTeamPassword(e.target.value)}
          placeholder="Enter 4-digit password"
          maxLength={4}
          className="w-full p-3 mb-4 border rounded text-lg"
        />
        <button
          onClick={handleCreateTeam}
          className="w-full p-3 bg-blue-500 text-white text-lg rounded hover:bg-blue-600"
        >
          Create Team
        </button>
      </div>

      {/* Remove Team Section */}
      <div className="mb-10 p-6 bg-white rounded shadow-lg w-1/2 max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Remove Team</h2>
        <input
          type="text"
          value={removeTeamId}
          onChange={(e) => setRemoveTeamId(e.target.value)}
          placeholder="Enter team ID"
          className="w-full p-3 mb-4 border rounded text-lg"
        />
        <input
          type="text"
          value={removePassword}
          onChange={(e) => setRemovePassword(e.target.value)}
          placeholder="Enter team password"
          maxLength={4}
          className="w-full p-3 mb-4 border rounded text-lg"
        />
        <button
          onClick={handleRemoveTeam}
          className="w-full p-3 bg-red-500 text-white text-lg rounded hover:bg-red-600"
        >
          Remove Team
        </button>
      </div>

      {/* Game Control Section */}
      <div className="mb-10 p-6 bg-white rounded shadow-lg w-1/2 max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Game Control</h2>
        <button
          onClick={handleStartNewGame}
          className="w-full p-3 bg-green-500 text-white text-lg rounded hover:bg-green-600"
        >
          Start New Game
        </button>
      </div>
    </div>
  );
};

export default ControlPage;