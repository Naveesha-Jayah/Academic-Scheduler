import React, { useEffect, useState } from "react";

const ConflictList = () => {
  const [conflicts, setConflicts] = useState([]);
  const [solutions, setSolutions] = useState([]);

  useEffect(() => {
    const storedConflicts = JSON.parse(localStorage.getItem("conflicts")) || [];
    setConflicts(storedConflicts);
    generateSolutions(storedConflicts);
  }, []);

  const generateSolutions = (conflicts) => {
    const newSolutions = conflicts.map(({ conflict, conflictingWith }) => {
      return {
        conflict,
        solution: findSolution(conflict, conflictingWith),
      };
    });
    setSolutions(newSolutions);
  };

  const findSolution = (entry, otherEntry) => {
    const availableRooms = ["L103", "L106", "L107", "L105"]; // Example available rooms
    const availableTimeSlots = ["08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00"]; // Example available time slots
  
    let solution = "";
  
    // Try changing the room
    for (let room of availableRooms) {
      if (room !== entry.room) {
        solution = `Move ${entry.moduleName} to ${room}`;
        break; // Exit loop once a solution is found
      }
    }
  
    // If no room was found, try changing the time slot
    if (!solution) {
      for (let slot of availableTimeSlots) {
        if (slot !== entry.timeSlot) {
          solution = `Reschedule ${entry.moduleName} to ${slot}`;
          break; // Exit loop once a solution is found
        }
      }
    }
  
    // If no solution found
    return solution || "No solution found. Manual adjustment needed.";
  };
  

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Conflict Solutions</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Module</th>
            <th className="py-2 px-4 border">Current Room</th>
            <th className="py-2 px-4 border">Current Time</th>
            <th className="py-2 px-4 border">Solution</th>
          </tr>
        </thead>
        <tbody>
          {solutions.length > 0 ? (
            solutions.map((entry, index) => (
              <tr key={index} className="border">
                <td className="py-2 px-4 border">{entry.conflict.moduleName}</td>
                <td className="py-2 px-4 border">{entry.conflict.room}</td>
                <td className="py-2 px-4 border">{entry.conflict.timeSlot}</td>
                <td className="py-2 px-4 border text-green-600 font-bold">{entry.solution}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-4 text-center text-gray-500">No Conflicts Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ConflictList;
