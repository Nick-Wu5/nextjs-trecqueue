import { NextApiRequest, NextApiResponse } from "next";

interface Team {
    id: string;
    name: string;
    password: string; // Four-digit password stored as a string
}

let teams: Team[] = []; // Array to store team data, including password

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, password } = req.body;

    // Validate that password is a four-digit string
    if (!/^\d{4}$/.test(password)) {
      return res.status(400).json({ error: 'Password must be a four-digit string.' });
    }

    const newTeam: Team = { id: Date.now().toString(), name, password };
    teams.push(newTeam);
    res.status(201).json(newTeam);
  } else if (req.method === 'GET') {
    res.status(200).json(teams);
  } else {
    res.status(405).end(); // Method not allowed
  }
}