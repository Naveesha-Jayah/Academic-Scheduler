import React, { useEffect, useState } from "react";
import axiosInstance from "../../Lib/axios";
import jsPDF from "jspdf";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    year: "",
    semester: "",
    moduleCode: "",
    moduleName: "",
  });
  const [editingCourse, setEditingCourse] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await axiosInstance.put(`/api/course/${editingCourse._id}`, form);
      } else {
        await axiosInstance.post("/api/course", form);
      }
      setForm({ year: "", semester: "", moduleCode: "", moduleName: "" });
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      console.error("Error saving course", error);
    }
  };

  const handleEdit = (course) => {
    setForm(course);
    setEditingCourse(course);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/course/${id}`);
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course", error);
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Course List Report", 20, 20);
    doc.setFontSize(12);
    let yPosition = 30;

    doc.text("Year | Semester | Module Code | Module Name", 20, yPosition);
    yPosition += 10;

    courses.forEach((course) => {
      doc.text(
        `${course.year} | ${course.semester} | ${course.moduleCode} | ${course.moduleName}`,
        20,
        yPosition
      );
      yPosition += 10;
    });

    doc.save("course_report.pdf");
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Course Management</h1>
      
      {/* Add Course Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add or Edit Course</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
            placeholder="Year"
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="number"
            name="semester"
            value={form.semester}
            onChange={handleChange}
            placeholder="Semester"
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="text"
            name="moduleCode"
            value={form.moduleCode}
            onChange={handleChange}
            placeholder="Module Code"
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="text"
            name="moduleName"
            value={form.moduleName}
            onChange={handleChange}
            placeholder="Module Name"
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors sm:col-span-2"
          >
            {editingCourse ? "Update Course" : "Add Course"}
          </button>
        </form>
      </div>
      
      {/* Course List Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Course List</h2>
        <div className="mb-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search courses..."
            className="border-2 border-gray-300 p-3 w-2/3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
              <th className="py-3 px-6 text-left">Year</th>
              <th className="py-3 px-6 text-left">Semester</th>
              <th className="py-3 px-6 text-left">Module Code</th>
              <th className="py-3 px-6 text-left">Module Name</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses
              .filter((course) =>
                course.moduleName.toLowerCase().includes(search.toLowerCase())
              )
              .map((course) => (
                <tr key={course._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">{course.year}</td>
                  <td className="py-3 px-6">{course.semester}</td>
                  <td className="py-3 px-6">{course.moduleCode}</td>
                  <td className="py-3 px-6">{course.moduleName}</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => handleEdit(course)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
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

export default CourseManagement;
