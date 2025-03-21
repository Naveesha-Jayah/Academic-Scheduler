import React, { useEffect, useState } from "react";
import axiosInstance from "../../Lib/axios";
import jsPDF from "jspdf";

const TimeTableManagement = () => {
  const [timeTables, setTimeTables] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    moduleCode: "",
    moduleName: "",
    lectureName: "",
    room: "",
    timeSlot: "",
    year: "",
    semester: "",
    day: "", // New field for day
  });
  const [editingTimeTable, setEditingTimeTable] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTimeTables();
    fetchRooms();
  }, []);

  useEffect(() => {
    if (form.year && form.semester) {
      fetchCourses(form.year, form.semester);
    }
  }, [form.year, form.semester]);

  const fetchTimeTables = async () => {
    try {
      const response = await axiosInstance.get("/api/timeTable");
      setTimeTables(response.data);
    } catch (error) {
      console.error("Error fetching time tables", error);
      setError("Error fetching time tables. Please try again.");
    }
  };

  const fetchCourses = async (year, semester) => {
    try {
      const response = await axiosInstance.get(`/api/course?year=${year}&semester=${semester}`);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses", error);
      setError("Error fetching courses. Please try again.");
    }
  };

  const fetchLectures = async (moduleName) => {
    try {
      const response = await axiosInstance.get("/api/lecture");
      const filteredLectures = response.data.filter(
        (lecture) => lecture.moduleName === moduleName
      );
      setLectures(filteredLectures);
    } catch (error) {
      console.error("Error fetching lectures", error);
      setError("Error fetching lectures. Please try again.");
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axiosInstance.get("/api/room");
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms", error);
      setError("Error fetching rooms. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "moduleName") {
      const selectedCourse = courses.find((course) => course.moduleName === value);
      if (selectedCourse) {
        setForm((prev) => ({
          ...prev,
          moduleCode: selectedCourse.moduleCode,
          lectureName: "",
        }));
        fetchLectures(value);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTimeTable) {
        await axiosInstance.put(`/api/timeTable/${editingTimeTable._id}`, form);
      } else {
        await axiosInstance.post("/api/timeTable", form);
      }
      setForm({
        year: "",
        semester: "",
        moduleCode: "",
        moduleName: "",
        lectureName: "",
        room: "",
        timeSlot: "",
        day: "", // Reset the day field after submit
      });
      setEditingTimeTable(null);
      fetchTimeTables();
    } catch (error) {
      console.error("Error saving time table", error);
      setError("Error saving time table. Please try again.");
    }
  };

  const handleEdit = (timeTable) => {
    setForm(timeTable);
    setEditingTimeTable(timeTable);
    fetchLectures(timeTable.moduleName);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/timeTable/${id}`);
      fetchTimeTables();
    } catch (error) {
      console.error("Error deleting time table", error);
      setError("Error deleting time table. Please try again.");
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Time Table Report", 20, 20);
    doc.setFontSize(12);
    let yPosition = 30;

    doc.text("Day | Year | Semester | Module Code | Module Name | Lecture Name | Room | Time Slot", 20, yPosition);
    yPosition += 10;

    timeTables.forEach((timeTable) => {
      doc.text(
        `${timeTable.day} | ${timeTable.year} | ${timeTable.semester} | ${timeTable.moduleCode} | ${timeTable.moduleName} | ${timeTable.lectureName} | ${timeTable.room} | ${timeTable.timeSlot}`,
        20,
        yPosition
      );
      yPosition += 10;
    });

    doc.save("time_table_report.pdf");
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Time Table Management</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {editingTimeTable ? "Edit Time Table" : "Add New Time Table"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <select
            name="year"
            value={form.year}
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Select Year</option>
            {[1, 2, 3, 4].map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                Year {yearOption}
              </option>
            ))}
          </select>

          <select
            name="semester"
            value={form.semester}
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Select Semester</option>
            {[1, 2].map((semesterOption) => (
              <option key={semesterOption} value={semesterOption}>
                Semester {semesterOption}
              </option>
            ))}
          </select>

          <select
            name="moduleName"
            value={form.moduleName}
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
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
            placeholder="Module Code"
            readOnly
            className="border-2 border-gray-300 p-3 rounded-md bg-gray-100"
          />

          <select
            name="lectureName"
            value={form.lectureName}
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
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
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
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
            name="timeSlot"
            value={form.timeSlot}
            onChange={handleChange}
            required
            className="border-2 border-gray-300 p-3 rounded-md"
          />

          {/* Day dropdown */}
          <select
            name="day"
            value={form.day}
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
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
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors sm:col-span-2"
          >
            {editingTimeTable ? "Update Time Table" : "Add Time Table"}
          </button>
        </form>
      </div>

      <button
        onClick={generateReport}
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
      >
        Generate Report
      </button>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Time Table List</h2>

        <input
          type="text"
          placeholder="Search..."
          className="border-2 border-gray-300 p-3 rounded-md mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr>
               {/* Added Day column */}
              <th className="border px-4 py-2">Year</th>
              <th className="border px-4 py-2">Semester</th>
              <th className="border px-4 py-2">Module Code</th>
              <th className="border px-4 py-2">Module Name</th>
              <th className="border px-4 py-2">Lecture Name</th>
              <th className="border px-4 py-2">Room</th>
              <th className="border px-4 py-2">Time Slot</th>
              <th className="border px-4 py-2">Day</th>
              <th className="border px-4 py-2">Actions</th>
              
            </tr>
          </thead>
          <tbody>
            {timeTables
              .filter((timeTable) =>
                timeTable.moduleName.toLowerCase().includes(search.toLowerCase())
              )
              .map((timeTable) => (
                <tr key={timeTable._id}>
                  {/* Display Day */}
                  <td className="border px-4 py-2">{timeTable.year}</td>
                  <td className="border px-4 py-2">{timeTable.semester}</td>
                  <td className="border px-4 py-2">{timeTable.moduleCode}</td>
                  <td className="border px-4 py-2">{timeTable.moduleName}</td>
                  <td className="border px-4 py-2">{timeTable.lectureName}</td>
                  <td className="border px-4 py-2">{timeTable.room}</td>
                  <td className="border px-4 py-2">{timeTable.timeSlot}</td>
                  <td className="border px-4 py-2">{timeTable.day}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(timeTable)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(timeTable._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeTableManagement;
