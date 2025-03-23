import React, { useState } from "react";
import Timetable from "../TimeTest/timeTable"; // Ensure this path is correct

const StudentProfile = () => {
  // State for selected year and semester
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [timetableData, setTimetableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Mock function to fetch timetable data (replace with actual API call)
  const fetchTimetableData = async (year, semester) => {
    // Simulate fetching data based on year and semester
    const mockData = [
      {
        _id: "1",
        day: "Monday",
        moduleName: "Mathematics",
        lectureName: "Dr. Smith",
        room: "Room 101",
        timeSlot: "09:00 AM - 10:00 AM",
        year: 1,
        semester: 1,
      },
      {
        _id: "2",
        day: "Tuesday",
        moduleName: "Physics",
        lectureName: "Dr. Johnson",
        room: "Room 202",
        timeSlot: "11:00 AM - 12:00 PM",
        year: 1,
        semester: 1,
      },
      {
        _id: "3",
        day: "Wednesday",
        moduleName: "Chemistry",
        lectureName: "Dr. Brown",
        room: "Room 303",
        timeSlot: "01:00 PM - 02:00 PM",
        year: 1,
        semester: 1,
      },
    ];

    // Filter mock data based on year and semester
    return mockData.filter(
      (entry) => entry.year === year && entry.semester === semester
    );
  };

  // Handle generating the timetable
  const handleGenerateTimetable = async () => {
    if (!selectedYear || !selectedSemester) {
      setError("Please select both year and semester.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await fetchTimetableData(selectedYear, selectedSemester);
      setTimetableData(data);
    } catch (err) {
      setError("Failed to fetch timetable data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Student Timetable
      </h1>

      {/* Year and Semester Selection */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Select Year and Semester
        </h2>
        <div className="flex gap-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg"
          >
            <option value="">Select Year</option>
            {[1, 2, 3, 4].map((year) => (
              <option key={year} value={year}>
                Year {year}
              </option>
            ))}
          </select>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg"
          >
            <option value="">Select Semester</option>
            {[1, 2].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
          <button
            onClick={handleGenerateTimetable}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Generate Timetable
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Loading State */}
      {loading && <p className="text-center mb-4">Loading timetable...</p>}

      {/* Display Timetable */}
      {!loading && timetableData.length > 0 && (
        <Timetable timetableData={timetableData} />
      )}

      {/* No Data Message */}
      {!loading && timetableData.length === 0 && !error && (
        <p className="text-center text-gray-600">
          No timetable data available for the selected year and semester.
        </p>
      )}
    </div>
  );
};

export default StudentProfile;