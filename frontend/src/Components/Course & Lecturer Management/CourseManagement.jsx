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
  const [filterYear, setFilterYear] = useState("");
  const [filterSemester, setFilterSemester] = useState("");

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
    const { name, value } = e.target;

    // Validation for Year (1 to 4)
    if (name === "year") {
      const yearValue = parseInt(value, 10);
      if (yearValue < 1 || yearValue > 4) {
        alert("Year must be between 1 and 4.");
        return;
      }
    }

    // Validation for Semester (1 or 2)
    if (name === "semester") {
      const semesterValue = parseInt(value, 10);
      if (semesterValue < 1 || semesterValue > 2) {
        alert("Semester must be either 1 or 2.");
        return;
      }
    }

    setForm({ ...form, [name]: value });
  };

  const validateCourse = async () => {
    const { moduleCode, moduleName, _id } = form;

    // Check if the module code already exists for a different module name
    const existingCourse = courses.find(
      (course) =>
        course.moduleCode === moduleCode &&
        course.moduleName !== moduleName &&
        course._id !== _id // Exclude the current course being edited
    );

    if (existingCourse) {
      alert(
        `Module Code "${moduleCode}" is already used for another module: "${existingCourse.moduleName}".`
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the course before saving
    const isValid = await validateCourse();
    if (!isValid) return;

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

  // Filter courses based on search, year, and semester
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.moduleName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesYear = filterYear
      ? course.year === parseInt(filterYear, 10)
      : true;
    const matchesSemester = filterSemester
      ? course.semester === parseInt(filterSemester, 10)
      : true;
    return matchesSearch && matchesYear && matchesSemester;
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Course Management
      </h1>

      {/* Add Course Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Add or Edit Course
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <input
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
            placeholder="Year (1-4)"
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            min="1"
            max="4"
          />
          <input
            type="number"
            name="semester"
            value={form.semester}
            onChange={handleChange}
            placeholder="Semester (1-2)"
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            min="1"
            max="2"
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
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors w-50"
          >
            {editingCourse ? "Update Course" : "Add Course"}
          </button>
        </form>
      </div>

      {/* Course List Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Course List
        </h2>
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search courses..."
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-grow"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Years</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>
          <select
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Semesters</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
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
              <th className="py-3 px-6 text-left">Year</th>
              <th className="py-3 px-6 text-left">Semester</th>
              <th className="py-3 px-6 text-left">Module Code</th>
              <th className="py-3 px-6 text-left">Module Name</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => (
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
