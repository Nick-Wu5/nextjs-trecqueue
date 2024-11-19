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
      return res.status(200).json(teams);

    } else if (req.method === 'POST') {
      // Add a new team
      console.log('Handling POST request');
      const { teamName, password } = req.body;

      if (!teamName || !password) {
        return res.status(200).json({ error: 'Team name and password are required' });
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
          return res.status(200).json({ message: "Team name and password are required" });
        }
    
        // Validate the password
        const { data: team, error: fetchError } = await supabase
          .from("teams")
          .select("id, password")
          .ilike("teamName", teamName)
          .single();
    
        if (fetchError || !team) {
          return res.status(200).json({ message: "Team not found" });
        }
    
        if (team.password !== password) {
          return res.status(200).json({ message: "Incorrect password" });
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
        return res.status(200).json({ message: "Failed to delete team", error });
      }
    } else if (req.method === 'PUT') {
      try {
        const { orderedTeams, teamName, streak, resetAll } = req.body; // Get orderedTeams, teamName, and streak from request body
    
        if (resetAll) {
          // Reset streaks for all teams
          const { error } = await supabase
            .from('teams')
            .update({ streak: 0 })
            .neq('id', 0);

            console.log("reset streaks");
      
          if (error) {
            console.error('Error resetting streaks:', error.message);
            return res.status(500).json({ error: 'Failed to reset streaks for all teams' });
          }
        }

        // Update team positions
        if (orderedTeams) {
          if (!Array.isArray(orderedTeams)) {
            return res.status(200).json({ error: 'Invalid team order provided' });
          }
    
          const updates = orderedTeams.map(({ id, position }) =>
            supabase
              .from('teams')
              .update({ position })
              .eq('id', id)
          );
          await Promise.all(updates);
          console.log('Team positions updated in the database');
        }
    
        // Update streak
        if (teamName && typeof streak === 'number') {
          const { data, error } = await supabase
            .from('teams')
            .update({ streak })
            .eq('teamName', teamName);

            console.log("increased streaks");
    
          if (error) {
            console.error('Error updating team streak:', error.message);
            return res.status(500).json({ error: 'Failed to update team streak' });
          }
    
          return res.status(200).json({ message: 'Team streak updated successfully', data });
        }
    
        // Handle invalid request data
        return res.status(200).json({ error: 'Invalid request data for updating streak or positions' });
      } catch (error) {
        console.error('Error updating team positions or streak:', error);
        return res.status(200).json({ error: 'Failed to update team positions or streak' });
      }
    }
     else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(200).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
  }
}