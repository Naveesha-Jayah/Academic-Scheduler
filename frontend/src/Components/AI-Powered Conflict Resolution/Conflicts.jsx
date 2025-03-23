import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axiosInstance from "../../Lib/axios";

const Conflicts = () => {
  const [conflicts, setConflicts] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchConflicts();
  }, []);

  const fetchConflicts = async () => {
    try {
      const response = await axiosInstance.get("/api/timeTable");
      const timeTables = response.data;

      const isOverlapping = (time1, time2) => {
        const [start1, end1] = time1.split(" - ").map(t => t.trim());
        const [start2, end2] = time2.split(" - ").map(t => t.trim());
        return !(end1 <= start2 || end2 <= start1);
      };

      const conflictsList = [];
      timeTables.forEach((entry, i) => {
        timeTables.forEach((otherEntry, j) => {
          if (
            i !== j &&
            entry.day === otherEntry.day &&
            entry.room === otherEntry.room &&
            isOverlapping(entry.timeSlot, otherEntry.timeSlot)
          ) {
            conflictsList.push(entry);
          }
        });
      });

      setConflicts(conflictsList);
    } catch (error) {
      console.error("Error fetching timetable conflicts", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Time Table Conflicts</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Day</th>
            <th className="py-2 px-4 border">Module</th>
            <th className="py-2 px-4 border">Lecture</th>
            <th className="py-2 px-4 border">Room</th>
            <th className="py-2 px-4 border">Time Slot</th>
          </tr>
        </thead>
        <tbody>
          {conflicts.length > 0 ? (
            conflicts.map((entry, index) => (
              <tr key={index} className="border">
                <td className="py-2 px-4 border">{entry.day}</td>
                <td className="py-2 px-4 border">{entry.moduleName}</td>
                <td className="py-2 px-4 border">{entry.lectureName}</td>
                <td className="py-2 px-4 border">{entry.room}</td>
                <td className="py-2 px-4 border">{entry.timeSlot}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-4 text-center text-gray-500">No Conflicts Found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Button to navigate to Conflict List page */}
      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/conflict-list")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Conflicts List
        </button>
      </div>
    </div>
  );
};

export default Conflicts;
