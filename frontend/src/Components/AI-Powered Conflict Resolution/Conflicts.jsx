import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ Import useNavigate
import axiosInstance from "../../Lib/axios";

const ConflictsPage = () => {
  const [timeTables, setTimeTables] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");

  const navigate = useNavigate(); // ⬅️ Initialize navigate

  useEffect(() => {
    const fetchTimeTables = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/api/timeTable");
        setTimeTables(response.data);
      } catch (error) {
        console.error("Error fetching time tables", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTimeTables();
  }, []);

  useEffect(() => {
    if (timeTables.length > 0) {
      const detectedConflicts = detectConflicts(timeTables);
      setConflicts(detectedConflicts);
    }
  }, [timeTables]);

  const detectConflicts = (entries) => {
    const conflicts = [];
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const a = entries[i];
        const b = entries[j];
        if (a.day === b.day && a.timeSlot === b.timeSlot) {
          if (a.room === b.room) {
            conflicts.push({
              type: "Room Conflict",
              message: `Room "${a.room}" is double-booked on ${a.day} at ${a.timeSlot}`,
              entries: [a, b],
            });
          }
          if (a.lectureName === b.lectureName) {
            conflicts.push({
              type: "Lecture Conflict",
              message: `Lecture "${a.lectureName}" has overlapping classes on ${a.day} at ${a.timeSlot}`,
              entries: [a, b],
            });
          }
        }
      }
    }
    return conflicts;
  };

  const filteredConflicts = filterType === "all" 
    ? conflicts 
    : conflicts.filter(conflict => conflict.type === filterType);

  const getConflictTypeColor = (type) => {
    switch (type) {
      case "Room Conflict": 
        return "bg-orange-100 border-orange-400 text-orange-800";
      case "Lecture Conflict": 
        return "bg-purple-100 border-purple-400 text-purple-800";
      default: 
        return "bg-red-100 border-red-400 text-red-700";
    }
  };

  const getDayBadgeColor = (day) => {
    const dayColors = {
      "Monday": "bg-blue-500",
      "Tuesday": "bg-green-500",
      "Wednesday": "bg-yellow-500",
      "Thursday": "bg-purple-500",
      "Friday": "bg-pink-500",
      "Saturday": "bg-indigo-500",
      "Sunday": "bg-red-500"
    };
    return dayColors[day] || "bg-gray-500";
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">Time Table Conflicts</h1>
          <p className="text-center text-gray-500 mb-6">Manage and resolve scheduling issues in your timetable</p>

          {/* 🔗 Navigation Button */}
          <div className="text-center mb-6">
            <button
              onClick={() => navigate("/conflict-list")}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition transform duration-300"
            >
              View Full Conflict List
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              {conflicts.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    <button 
                      onClick={() => setFilterType("all")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                        filterType === "all" 
                          ? "bg-indigo-600 text-white" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      All Conflicts ({conflicts.length})
                    </button>
                    <button 
                      onClick={() => setFilterType("Room Conflict")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                        filterType === "Room Conflict" 
                          ? "bg-orange-600 text-white" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Room Conflicts ({conflicts.filter(c => c.type === "Room Conflict").length})
                    </button>
                    <button 
                      onClick={() => setFilterType("Lecture Conflict")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                        filterType === "Lecture Conflict" 
                          ? "bg-purple-600 text-white" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Lecture Conflicts ({conflicts.filter(c => c.type === "Lecture Conflict").length})
                    </button>
                  </div>
                
                  <div className="grid grid-cols-1 gap-4 md:gap-6">
                    {filteredConflicts.map((conflict, index) => (
                      <div 
                        key={index} 
                        className={`border rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${getConflictTypeColor(conflict.type)}`}
                      >
                        <div className="p-4">
                          <div className="flex items-center mb-2">
                            {conflict.type === "Room Conflict" ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            )}
                            <h2 className="font-bold">{conflict.type}</h2>
                          </div>
                          <p className="text-sm md:text-base">{conflict.message}</p>
                          
                          <div className="mt-4 space-y-3">
                            {conflict.entries.map((entry, idx) => (
                              <div key={idx} className="bg-white bg-opacity-50 p-3 rounded border border-opacity-30">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getDayBadgeColor(entry.day)}`}>
                                    {entry.day}
                                  </span>
                                  <span className="px-2 py-1 bg-gray-200 rounded-full text-xs font-medium text-gray-700">
                                    {entry.timeSlot}
                                  </span>
                                  <span className="px-2 py-1 bg-blue-100 rounded-full text-xs font-medium text-blue-700">
                                    Room {entry.room}
                                  </span>
                                </div>
                                <div className="text-sm">
                                  <p className="font-semibold">{entry.moduleName}</p>
                                  <p className="text-gray-600">{entry.lectureName}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {conflicts.length === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h2 className="text-2xl font-bold text-green-700 mb-2">No Conflicts Detected!</h2>
                  <p className="text-green-600">Your timetable is conflict-free and ready to use.</p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="text-center text-gray-500 text-sm">
          <p>Total timetable entries: {timeTables.length}</p>
        </div>
      </div>
    </div>
  );
};

export default ConflictsPage;
