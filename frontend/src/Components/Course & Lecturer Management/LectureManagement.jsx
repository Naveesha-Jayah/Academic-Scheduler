import React, { useEffect, useState } from "react";
import axiosInstance from "../../Lib/axios";
import jsPDF from "jspdf";

const LectureManagement = () => {
  const [lectures, setLectures] = useState([]);
  const [courses, setCourses] = useState([]); // Store course data
  const [form, setForm] = useState({
    lectureID: "",
    lectureName: "",
    email: "",
    moduleName: "",
  });
  const [editingLecture, setEditingLecture] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedModule, setSelectedModule] = useState(""); // State for selected module filter
  const [error, setError] = useState(""); // State for error message

  useEffect(() => {
    fetchLectures();
    fetchCourses(); // Fetch courses for dropdown
  }, []);

  const fetchLectures = async () => {
    try {
      const response = await axiosInstance.get("/api/lecture");
      setLectures(response.data);
    } catch (error) {
      console.error("Error fetching lectures", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get("/api/course");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error message when user types
  };

  const validateLectureID = (lectureID) => {
    // Check if the lectureID already exists in the lectures array
    const isDuplicate = lectures.some(
      (lecture) => lecture.lectureID === lectureID && lecture._id !== editingLecture?._id
    );
    return !isDuplicate; // Return true if the lectureID is unique
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate lectureID
    if (!validateLectureID(form.lectureID)) {
      setError("Lecture ID already exists. Please use a unique ID.");
      return;
    }

    try {
      if (editingLecture) {
        await axiosInstance.put(`/api/lecture/${editingLecture._id}`, form);
      } else {
        await axiosInstance.post("/api/lecture", form);
      }
      setForm({ lectureID: "", lectureName: "", email: "", moduleName: "" });
      setEditingLecture(null);
      setError(""); // Clear error message on successful submission
      fetchLectures();
    } catch (error) {
      console.error("Error saving lecture", error);
    }
  };

  const handleEdit = (lecture) => {
    setForm(lecture);
    setEditingLecture(lecture);
    setError(""); // Clear error message when editing
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/lecture/${id}`);
      fetchLectures();
    } catch (error) {
      console.error("Error deleting lecture", error);
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Lecture List Report", 20, 20);
    doc.setFontSize(12);
    let yPosition = 30;

    doc.text("Lecture ID | Name | Email | Module Name", 20, yPosition);
    yPosition += 10;

    lectures.forEach((lecture) => {
      doc.text(
        `${lecture.lectureID} | ${lecture.lectureName} | ${lecture.email} | ${lecture.moduleName}`,
        20,
        yPosition
      );
      yPosition += 10;
    });

    doc.save("lecture_report.pdf");
  };

  // Filter lectures based on search term and selected module
  const filteredLectures = lectures.filter((lecture) => {
    const matchesSearch = lecture.lectureName.toLowerCase().includes(search.toLowerCase());
    const matchesModule = selectedModule ? lecture.moduleName === selectedModule : true;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Lecture Management</h1>

      {/* Add/Edit Lecture Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {editingLecture ? "Edit Lecture" : "Add New Lecture"}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input
            type="text"
            name="lectureID"
            value={form.lectureID}
            onChange={handleChange}
            placeholder="Lecture ID"
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="text"
            name="lectureName"
            value={form.lectureName}
            onChange={handleChange}
            placeholder="Lecture Name"
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
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
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors w-50"
          >
            {editingLecture ? "Update Lecture" : "Add Lecture"}
          </button>
        </form>
      </div>

      {/* Lecture List Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Lecture List</h2>
        <div className="mb-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search lectures..."
            className="border-2 border-gray-300 p-3 w-1/3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="border-2 border-gray-300 p-3 w-1/3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Modules</option>
            {courses.map((course) => (
              <option key={course._id} value={course.moduleName}>
                {course.moduleName}
              </option>
            ))}
          </select>
          <button
            onClick={generateReport}
            className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors"
          >
            Generate Report
          </button>
        </div>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-indigo-100 text-gray-700">
              <th className="py-3 px-6 text-left">Lecture ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Module</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLectures.map((lecture) => (
              <tr key={lecture._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">{lecture.lectureID}</td>
                <td className="py-3 px-6">{lecture.lectureName}</td>
                <td className="py-3 px-6">{lecture.email}</td>
                <td className="py-3 px-6">{lecture.moduleName}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => handleEdit(lecture)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(lecture._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
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

export default LectureManagement;