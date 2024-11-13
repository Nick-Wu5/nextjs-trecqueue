// File: pages/api/teams.js
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next'; // Types for Next.js API routes

// Type definitions from global.d.ts
const filePath = path.resolve(process.cwd(), 'data/teams.json');

// Helper function to read the team list
const readTeams = (): Team[] => {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data) as Team[];
};

// Helper function to write the team list
const writeTeams = (teams: Team[]) => {
  fs.writeFileSync(filePath, JSON.stringify(teams, null, 2), 'utf8');
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  
    if (req.method === 'GET') {
    // Fetch the current team list
    const teams = readTeams();
    console.log("Teams loaded:", teams); // Log the teams to confirm loading
    res.status(200).json(teams);

  } else if (req.method === 'POST') {
    // Add a new team
    const { name, password } = req.body;
    const teams = readTeams();
    teams.push({ name, password, id: Date.now().toString() });
    writeTeams(teams);
    console.log("Updated teams.json after POST:", teams); // Log to confirm update
    res.status(201).json({ message: 'Team added successfully' });

  } else if (req.method === 'DELETE') {
    // Remove a team by ID
    const { id, password } = req.body;
    const teams = readTeams();
    const teamIndex = teams.findIndex((team: Team) => team.id === id && team.password === password);

    if (teamIndex === -1) {
      return res.status(404).json({ error: 'Team not found or incorrect password' });
    }

    teams.splice(teamIndex, 1);
    writeTeams(teams);
    res.status(200).json({ message: 'Team removed successfully' });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}