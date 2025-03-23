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
    day: "",
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
    }
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
      const filteredLectures = response.data.filter(
        (lecture) => lecture.moduleName === moduleName
      );
      setLectures(filteredLectures);
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
        day: "",
      });
      setEditingTimeTable(null);
      fetchTimeTables();
    } catch (error) {
      console.error("Error saving time table", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Time Table Management</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {editingTimeTable ? "Edit Time Table" : "Add New Time Table"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <select name="year" value={form.year} onChange={handleChange} required>
            <option value="">Select Year</option>
            {[1, 2, 3, 4].map((yearOption) => (
              <option key={yearOption} value={yearOption}>Year {yearOption}</option>
            ))}
          </select>

          <select name="semester" value={form.semester} onChange={handleChange} required>
            <option value="">Select Semester</option>
            {[1, 2].map((semesterOption) => (
              <option key={semesterOption} value={semesterOption}>Semester {semesterOption}</option>
            ))}
          </select>

          <select name="moduleName" value={form.moduleName} onChange={handleChange} required>
            <option value="">Select Module</option>
            {courses.map((course) => (
              <option key={course._id} value={course.moduleName}>{course.moduleName}</option>
            ))}
          </select>

          <input type="text" name="moduleCode" value={form.moduleCode} placeholder="Module Code" readOnly />
          <select name="lectureName" value={form.lectureName} onChange={handleChange} required>
            <option value="">Select Lecture</option>
            {lectures.map((lecture) => (
              <option key={lecture._id} value={lecture.lectureName}>{lecture.lectureName}</option>
            ))}
          </select>

          <select name="room" value={form.room} onChange={handleChange} required>
            <option value="">Select Room</option>
            {rooms.map((room) => (
              <option key={room._id} value={room.roomName}>{room.roomName}</option>
            ))}
          </select>

          <input type="time" name="timeSlot" value={form.timeSlot} onChange={handleChange} required />

          <select name="day" value={form.day} onChange={handleChange} required>
            <option value="">Select Day</option>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>

          <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-md">{editingTimeTable ? "Update" : "Add"}</button>
        </form>
      </div>
    </div>
  );
};

export default TimeTableManagement;
