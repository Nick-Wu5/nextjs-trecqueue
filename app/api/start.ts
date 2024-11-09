import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Logic to start a new game
    res.status(200).json({ message: 'Game started' });
  } else {
    res.status(405).end(); // Method not allowed
  }
}