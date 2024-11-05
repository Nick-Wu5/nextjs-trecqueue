import React from 'react';
import Capsule from './Capsule';

/**
 * TeamList component renders a list of teams using the Capsule component.
 *
 * This component takes an array of team names as a prop and displays each name
 * inside a styled capsule, stacking them vertically.
 *
 * @param {TeamListProps} props - The props for the component.
 * @param {string[]} props.teams - An array of team names to display.
 * @returns {JSX.Element} The rendered list of team capsules.
 */
interface TeamListProps {
  teams: string[]; // Accepts an array of team names as props
}

const TeamList: React.FC<TeamListProps> = ({ teams }) => {
  return (
    <div className="flex flex-col items-center text-center gap-4">  {/* Flex container for stacking */}
      {teams.map((team, index) => (
        <div key={index} className="flex-shrink-0">  {/* Each team item */}
          <Capsule text={team} />  {/* Render the Capsule for each team */}
        </div>
      ))}
    </div>
  );
};

export default TeamList;
