import { NextApiRequest, NextApiResponse } from 'next';

interface Team {
  id: string;
  name: string;
  password: string;
}

let teams: Team[] = []; // Shared array to store team data

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { id } = req.query;
    const { password } = req.body;

    // Find the team by ID
    const teamIndex = teams.findIndex((team) => team.id === id);

    if (teamIndex === -1) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if the password matches
    const team = teams[teamIndex];
    if (team.password !== password) {
      return res.status(403).json({ error: 'Incorrect password' });
    }

    // Remove the team if the password is correct
    teams.splice(teamIndex, 1);
    res.status(200).json({ message: `Team with ID ${id} removed` });
  } else {
    res.status(405).end(); // Method not allowed
  }
}
