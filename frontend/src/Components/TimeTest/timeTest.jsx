import React, { useEffect, useState } from "react";
import axiosInstance from "../../Lib/axios";
import { saveAs } from "file-saver"; // For report generation
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"; // For PDF report generation
import Timetable from "../TimeTest/timeTable"; // Import the Timetable component

const TimeTest = () => {
  const [allTimeTables, setAllTimeTables] = useState({}); // Store all timetables grouped by year and semester
  const [courses, setCourses] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [editingId, setEditingId] = useState(null); // Track which entry is being edited
  const [form, setForm] = useState({
    moduleCode: "",
    moduleName: "",
    lectureName: "",
    room: "",
    startTime: "", // Start time with AM/PM
    endTime: "", // End time with AM/PM
    year: "",
    semester: "",
    day: "",
  });
  const [error, setError] = useState(""); // For validation error messages
  const [selectedYear, setSelectedYear] = useState(""); // Selected year for filtering
  const [selectedSemester, setSelectedSemester] = useState(""); // Selected semester for filtering
  const [filteredTimetable, setFilteredTimetable] = useState([]); // Filtered timetable data

  useEffect(() => {
    fetchRooms();
    fetchAllTimeTables(); // Fetch all timetables on component mount
  }, []);

  useEffect(() => {
    if (form.year && form.semester) {
      fetchCourses(form.year, form.semester);
    }
  }, [form.year, form.semester]);

  // Fetch all timetables and group them by year and semester
  const fetchAllTimeTables = async () => {
    try {
      const response = await axiosInstance.get("/api/timeTable");
      const grouped = groupTimeTablesByYearAndSemester(response.data);
      setAllTimeTables(grouped);
    } catch (error) {
      console.error("Error fetching all time tables", error);
    }
  };

  // Group timetables by year and semester
  const groupTimeTablesByYearAndSemester = (timetables) => {
    const grouped = {};
    timetables.forEach((tt) => {
      const key = `Year${tt.year}-Semester${tt.semester}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(tt);
    });
    return grouped;
  };

  const fetchCourses = async (year, semester) => {
    try {
      const response = await axiosInstance.get(`/api/course?year=${year}&semester=${semester}`);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses", error);
    }
  };

  const fetchLectures = async (moduleName) => {
    try {
      const response = await axiosInstance.get("/api/lecture");
      setLectures(response.data.filter((lecture) => lecture.moduleName === moduleName));
    } catch (error) {
      console.error("Error fetching lectures", error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axiosInstance.get("/api/room");
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "moduleName") {
      const selectedCourse = courses.find((course) => course.moduleName === value);
      if (selectedCourse) {
        setForm((prev) => ({ ...prev, moduleCode: selectedCourse.moduleCode }));
        fetchLectures(value);
      }
    }
  };

  // Validate timetable entry for conflicts
  const validateTimetable = (newEntry) => {
    const { year, semester, room, startTime, endTime, day, lectureName } = newEntry;

    // Check for overlapping entries in the same year and semester
    const key = `Year${year}-Semester${semester}`;
    const existingEntries = allTimeTables[key] || [];

    // Check for room conflict (only for overlapping time slots)
    const roomConflict = existingEntries.some(
      (entry) =>
        entry.room === room &&
        entry.day === day &&
        ((startTime >= entry.startTime && startTime < entry.endTime) ||
          (endTime > entry.startTime && endTime <= entry.endTime) ||
          (startTime <= entry.startTime && endTime >= entry.endTime))
    );

    // Check for lecturer conflict (only for overlapping time slots)
    const lecturerConflict = existingEntries.some(
      (entry) =>
        entry.lectureName === lectureName &&
        entry.day === day &&
        ((startTime >= entry.startTime && startTime < entry.endTime) ||
          (endTime > entry.startTime && endTime <= entry.endTime) ||
          (startTime <= entry.startTime && endTime >= entry.endTime))
    );

    if (roomConflict) {
      setError("Room is already booked at this time and day.");
      return false;
    }

    if (lecturerConflict) {
      setError("Lecturer is already assigned to another module at this time and day.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timeSlot = `${form.startTime} - ${form.endTime}`;
    const newEntry = { ...form, timeSlot };

    if (!validateTimetable(newEntry)) {
      return; // Stop if validation fails
    }

    try {
      if (editingId) {
        // Update existing entry
        await axiosInstance.put(`/api/timeTable/${editingId}`, newEntry);
        setEditingId(null);
      } else {
        // Add new entry
        await axiosInstance.post("/api/timeTable", newEntry);
      }
      setForm({
        year: "",
        semester: "",
        moduleCode: "",
        moduleName: "",
        lectureName: "",
        room: "",
        startTime: "",
        endTime: "",
        day: "",
      });
      // Refresh all timetables after adding/updating
      fetchAllTimeTables();
    } catch (error) {
      console.error("Error saving timetable", error);
    }
  };

  const handleEdit = (id) => {
    const entry = Object.values(allTimeTables)
      .flat()
      .find((tt) => tt._id === id);
    if (entry) {
      const [startTime, endTime] = entry.timeSlot.split(" - ");
      setForm({ ...entry, startTime, endTime });
      setEditingId(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/timeTable/${id}`);
      // Refresh all timetables after deletion
      fetchAllTimeTables();
    } catch (error) {
      console.error("Error deleting timetable", error);
    }
  };

  // Generate a PDF report for a timetable
  const generatePDFReport = async (timetables, key) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = height - 50;
    page.drawText(`Timetable Report for ${key}`, {
      x: 50,
      y,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    });

    y -= 30;
    page.drawText("Day | Module | Lecture | Room | Time Slot", {
      x: 50,
      y,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    y -= 20;
    timetables.forEach((tt) => {
      const text = `${tt.day} | ${tt.moduleName} | ${tt.lectureName} | ${tt.room} | ${tt.timeSlot}`;
      page.drawText(text, {
        x: 50,
        y,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      y -= 15;
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, `${key}_Timetable_Report.pdf`);
  };

  // Sort timetable entries by day (Monday to Friday)
  const sortTimetablesByDay = (timetables) => {
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    return timetables.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
  };

  // Sort timetables by year and semester
  const sortTimetablesByYearAndSemester = (timetables) => {
    return Object.keys(timetables)
      .sort((a, b) => {
        const [yearA, semesterA] = a.split("-").map((part) => parseInt(part.replace(/\D/g, "")));
        const [yearB, semesterB] = b.split("-").map((part) => parseInt(part.replace(/\D/g, "")));
        return yearA - yearB || semesterA - semesterB;
      })
      .reduce((acc, key) => {
        acc[key] = timetables[key];
        return acc;
      }, {});
  };

  // Handle year and semester selection for filtering
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
  };

  // Filter timetable data based on selected year and semester
  const handleGenerateTimetable = () => {
    const key = `Year${selectedYear}-Semester${selectedSemester}`;
    const timetableData = allTimeTables[key] || [];
    setFilteredTimetable(timetableData);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Time Table Management</h1>

      {/* Form to add/edit timetable entries */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-lg mb-6">
        <select
          name="year"
          value={form.year}
          onChange={handleChange}
          required
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
          name="semester"
          value={form.semester}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 rounded-lg"
        >
          <option value="">Select Semester</option>
          {[1, 2].map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>
        <select
          name="moduleName"
          value={form.moduleName}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 rounded-lg"
        >
          <option value="">Select Module</option>
          {courses.map((course) => (
            <option key={course._id} value={course.moduleName}>
              {course.moduleName}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="moduleCode"
          value={form.moduleCode}
          readOnly
          className="border border-gray-300 p-2 rounded-lg bg-gray-100"
        />
        <select
          name="lectureName"
          value={form.lectureName}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 rounded-lg"
        >
          <option value="">Select Lecture</option>
          {lectures.map((lecture) => (
            <option key={lecture._id} value={lecture.lectureName}>
              {lecture.lectureName}
            </option>
          ))}
        </select>
        <select
          name="room"
          value={form.room}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 rounded-lg"
        >
          <option value="">Select Room</option>
          {rooms.map((room) => (
            <option key={room._id} value={room.roomName}>
              {room.roomName}
            </option>
          ))}
        </select>
        <input
          type="time"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 rounded-lg"
        />
        <input
          type="time"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 rounded-lg"
        />
        <select
          name="day"
          value={form.day}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 rounded-lg"
        >
          <option value="">Select Day</option>
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors w-50"
        >
          {editingId ? "Update Schedule" : "Create Schedule"}
        </button>
        {error && <p className="col-span-2 text-red-500 text-center">{error}</p>}
      </form>

      {/* Year and Semester Selection for Filtering */}
      <div className="flex gap-4 mb-6">
        <select
          value={selectedYear}
          onChange={handleYearChange}
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
          onChange={handleSemesterChange}
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

      {/* Display Timetable */}
      {filteredTimetable.length > 0 && <Timetable timetableData={filteredTimetable} />}

      {/* Display all timetables grouped by year and semester */}
      {Object.entries(sortTimetablesByYearAndSemester(allTimeTables)).map(([key, timetables]) => (
        <div key={key} className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{key}</h2>
          <table className="w-full border table-auto">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-4 py-2 border">Day</th>
                <th className="px-4 py-2 border">Module</th>
                <th className="px-4 py-2 border">Lecture</th>
                <th className="px-4 py-2 border">Room</th>
                <th className="px-4 py-2 border">Time Slot</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortTimetablesByDay(timetables).map((tt) => (
                <tr key={tt._id} className="text-center">
                  <td className="px-4 py-2 border">{tt.day}</td>
                  <td className="px-4 py-2 border">{tt.moduleName}</td>
                  <td className="px-4 py-2 border">{tt.lectureName}</td>
                  <td className="px-4 py-2 border">{tt.room}</td>
                  <td className="px-4 py-2 border">{tt.timeSlot}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleEdit(tt._id)}
                      className="mr-2 bg-yellow-500 px-2 py-1 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tt._id)}
                      className="bg-red-500 px-2 py-1 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default TimeTest;