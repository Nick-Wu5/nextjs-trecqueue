import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabase-js';

// Helper function to read the team list
const readTeams = async () => {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('position', { ascending: true }); // Order by 'position' in ascending order
  if (error) throw error;
  return data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Request received:', req.method);

  try {
    if (req.method === 'GET') {
      // Fetch and return the current team list
      console.log('Handling GET request');
      const teams = await readTeams();
      console.log('Teams:', teams);
      return res.status(200).json(teams);

    } else if (req.method === 'POST') {
      // Add a new team
      console.log('Handling POST request');
      const { teamName, password } = req.body;

      console.log('Request Body:', req.body);

      if (!teamName || !password) {
        return res.status(400).json({ error: 'Team name and password are required' });
      }

      try {
        const { data, error } = await supabase
          .from('teams') // Ensure this matches your table name
          .insert([{ teamName, password }]);
    
        // Debugging: Log Supabase response
        if (error) {
          console.error('Supabase Error:', error);
          throw error;
        }
    
        console.log('Insert Success:', data);
        return res.status(201).json({ message: 'Team added successfully', team: data });
      } catch (error) {
        console.error('API Error:', error);
      }

    } else if (req.method === 'DELETE') {
      try {
        const { teamName, password } = req.body;
    
        if (!teamName || !password) {
          return res.status(400).json({ message: "Team name and password are required" });
        }
    
        // Validate the password
        const { data: team, error: fetchError } = await supabase
          .from("teams")
          .select("id, password")
          .ilike("teamName", teamName)
          .single();
    
        if (fetchError || !team) {
          return res.status(404).json({ message: "Team not found" });
        }
    
        if (team.password !== password) {
          return res.status(403).json({ message: "Incorrect password" });
        }
    
        // Delete the team
        const { error: deleteError } = await supabase
          .from("teams")
          .delete()
          .eq("id", team.id);
    
        if (deleteError) {
          throw deleteError;
        }
    
        return res.status(200).json({ message: "Team deleted successfully" });
      } catch (error) {
        console.error("Error deleting team:", error);
        return res.status(500).json({ message: "Failed to delete team", error });
      }
    } else if (req.method === 'PUT') {
      try {
        const { orderedTeams } = req.body; // Expecting an array of objects: [{ id: "1", position: 1 }, ...]
    
        if (!orderedTeams || !Array.isArray(orderedTeams)) {
          return res.status(400).json({ error: 'Invalid team order provided' });
        }
    
        // Update each team's position in the database
        const updates = orderedTeams.map(({ id, position }) =>
          supabase
            .from('teams')
            .update({ position }) // Update the 'position' column
            .eq('id', id)
        );
    
        // Wait for all updates to complete
        await Promise.all(updates);
    
        res.status(200).json({ message: 'Team positions updated successfully' });
      } catch (error) {
        console.error('Error updating team positions:', error);
        res.status(500).json({ error: 'Failed to update team positions' });
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
  }
}