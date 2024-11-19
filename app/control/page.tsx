"use client";

import React, { useEffect, useState } from "react";

const ControlPage: React.FC = () => {
  const [activePanel, setActivePanel] = useState<"add" | "remove" | null>(null);
  const [timer, setTimer] = useState("7:00");
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [teamId, setTeamId] = useState("");
  const [teamPassword, setTeamPassword] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<"win" | "draw" | null>(null);

  const closePanel = () => {
    setActivePanel(null);
    setTeamName("");
    setPassword("");
    setTeamId("");
    setTeamPassword("");
  };

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
        console.log("Fetched teams:", data);
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    }
  };

  // Initial fetch and periodic updates
  useEffect(() => {
    fetchTeams();
    const intervalId = setInterval(fetchTeams, 5000); // Refresh teams every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  const createTeam = async () => {
    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName, password }),
      });

      if (response.ok) {
        fetchTeams(); // Refresh teams after creation
        setActivePanel(null); // Close panel
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Failed to create team:", error);
      alert("An error occurred while creating the team.");
    }
  };

  const removeTeam = async () => {
    if (!teamName || !teamPassword) {
      alert("Please enter both the team name and password.");
      return;
    }

    try {
      const response = await fetch("/api/teams", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName, password: teamPassword }),
      });

      if (response.ok) {
        fetchTeams(); // Refresh teams after deletion
        setActivePanel(null); // Close panel
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Failed to remove team:", error);
      alert("An error occurred while removing the team.");
    }
  };

  const handleTeamOrderUpdate = async (action: "win" | "draw", winner: string | null) => {
    let updatedTeams = [...teams];
  
    if (action === "win" && winner) {
      const winningTeam = updatedTeams.find((team) => team.teamName === winner);
      if (winningTeam) {
        // Remove the winning team from the list
        updatedTeams = updatedTeams.filter((team) => team !== winningTeam);
        
        // Move the second team to the bottom of the list
        const secondTeam = updatedTeams[0]; // The second team is now at the top
        updatedTeams = updatedTeams.slice(1); // Remove the second team
        updatedTeams.push(secondTeam); // Add it to the bottom
  
        // Place the winning team at the top
        updatedTeams.unshift(winningTeam);
      }
    } else if (action === "draw") {
      const [teamA, teamB] = updatedTeams.splice(0, 2); // Get the top two teams
      updatedTeams.push(teamB, teamA); // Move them to the end in reverse order
    }
  
    setTeams(updatedTeams);
  
    // Update backend with new order
    const orderedTeams = updatedTeams.map((team, index) => ({
      id: team.id,
      position: index + 1, // Positions are 1-based
    }));
  
    try {
      const response = await fetch("/api/teams", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedTeams }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update team positions in the database");
      }
      console.log("Team positions updated successfully");
    } catch (error) {
      console.error("Error updating team positions:", error);
    }
  
    setConfirmationVisible(false);
    setSelectedWinner(null);
    setSelectedAction(null);
  };  

  const showConfirmationPanel = (action: "win" | "draw", winner: string | null) => {
    setSelectedAction(action);
    setSelectedWinner(winner);
    setConfirmationVisible(true);
  };

  const closeConfirmationPanel = () => {
    setConfirmationVisible(false);
    setSelectedWinner(null);
    setSelectedAction(null);
  };

  return (
    <div className="flex flex-col justify-evenly items-center min-h-screen bg-gray-50">
      {/* Timer and Status Text */}
      <div className="text-center mt-0">
        <div className="text-8xl font-semibold">GAME STATUS</div>
        <div className="border-t-4 border-black my-6 w-3/4 mx-auto"></div>
        <div className="text-9xl font-bold leading-none">{timer}</div>
      </div>

      {/* Pills for Top Two Teams */}
      <div className="flex justify-center items-center w-full max-w-4xl mt-0 mb-20">
        {teams.length >= 2 ? (
          <>
            <button
              onClick={() => showConfirmationPanel("win", teams[0].teamName)}
              className="flex-1 py-10 text-6xl font-bold rounded-l-full border bg-gray-200 hover:bg-gray-300"
              style={{ minWidth: "350px", minHeight: "140px" }} // Adjusted size for pills
            >
              {teams[0].teamName}
            </button>
            <button
              onClick={() => showConfirmationPanel("draw", null)}
              className="flex-1 py-10 text-6xl font-bold border bg-gray-200 hover:bg-gray-300"
              style={{ minWidth: "350px", minHeight: "140px" }} // Adjusted size for pills
            >
              Draw
            </button>
            <button
              onClick={() => showConfirmationPanel("win", teams[1].teamName)}
              className="flex-1 py-10 text-6xl font-bold rounded-r-full border bg-gray-200 hover:bg-gray-300"
              style={{ minWidth: "350px", minHeight: "140px" }} // Adjusted size for pills
            >
              {teams[1].teamName}
            </button>
          </>
        ) : (
          <p className="text-xl font-semibold">Loading teams...</p>
        )}
      </div>


      {/* Confirmation Panel */}
      {confirmationVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-3/4 md:w-1/2 max-w-lg">
            <button onClick={closeConfirmationPanel} className="absolute top-4 right-4">
              ×
            </button>
            <h2 className="text-2xl font-semibold mb-6">
              {selectedAction === "win" && selectedWinner
                ? `Confirm ${selectedWinner} won?`
                : "Confirm Draw?"}
            </h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeConfirmationPanel}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleTeamOrderUpdate(selectedAction!, selectedWinner)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add or Remove Panel */}
      <div className="relative">
        {/* Remove Team Button */}
        <div className="absolute bottom-0 right-80">
          <button
            onClick={() => setActivePanel("remove")}
            className="w-24 h-24 rounded-full text-6xl font-bold hover:opacity-70 bg-[#EBD99F]" // Original color restored
          >
            −
          </button>
        </div>

        {/* Add Team Button */}
        <div className="absolute bottom-0 left-80">
          <button
            onClick={() => setActivePanel("add")}
            className="w-24 h-24 rounded-full text-6xl font-bold hover:opacity-70 bg-[#EBD99F]" // Original color restored
          >
            +
          </button>
        </div>
      </div>

      {activePanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-3/4 md:w-1/2 max-w-lg relative">
            {/* Exit Button */}
            <button
              onClick={closePanel} // Close the panel when clicked
              className="absolute top-4 right-4 text-gray-500 text-3xl hover:text-gray-800 no-shadow"
              style={{ border: "none", background: "none" }} // Remove default button styles
            >
              ×
            </button>

            <h2 className="text-2xl font-semibold mb-6">
              {activePanel === "add" ? "Add Team" : "Remove Team"}
            </h2>

            {activePanel === "add" ? (
              <div>
                <input
                  type="text"
                  placeholder="Enter team name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full p-3 mb-4 border rounded"
                />
                <input
                  type="text"
                  placeholder="Enter 4-digit password"
                  maxLength={4}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 mb-4 border rounded"
                />
                <button
                  onClick={createTeam}
                  className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create Team
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="Enter team name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full p-3 mb-4 border rounded"
                />
                <input
                  type="text"
                  placeholder="Enter team password"
                  maxLength={4}
                  value={teamPassword}
                  onChange={(e) => setTeamPassword(e.target.value)}
                  className="w-full p-3 mb-4 border rounded"
                />
                <button
                  onClick={removeTeam}
                  className="w-full p-3 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove Team
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPage;