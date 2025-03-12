import React, { useEffect, useState } from "react";
import axiosInstance from "../../Lib/axios";
import jsPDF from "jspdf";

const TimeTableManagement = () => {
  const [timeTables, setTimeTables] = useState([]);
  const [form, setForm] = useState({
    moduleCode: "",
    moduleName: "",
    lectureName: "",
    room: "",
    timeSlot: "",
  });
  const [editingTimeTable, setEditingTimeTable] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTimeTables();
  }, []);

  const fetchTimeTables = async () => {
    try {
      const response = await axiosInstance.get("/api/timeTable");
      setTimeTables(response.data);
    } catch (error) {
      console.error("Error fetching time tables", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTimeTable) {
        await axiosInstance.put(`/api/timeTable/${editingTimeTable._id}`, form);
      } else {
        await axiosInstance.post("/api/timeTable", form);
      }
      setForm({ moduleCode: "", moduleName: "", lectureName: "", room: "", timeSlot: "" });
      setEditingTimeTable(null);
      fetchTimeTables();
    } catch (error) {
      console.error("Error saving time table", error);
    }
  };

  const handleEdit = (timeTable) => {
    setForm(timeTable);
    setEditingTimeTable(timeTable);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/timeTable/${id}`);
      fetchTimeTables();
    } catch (error) {
      console.error("Error deleting time table", error);
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Time Table Report", 20, 20);
    doc.setFontSize(12);
    let yPosition = 30;

    doc.text("Module Code | Module Name | Lecture Name | Room | Time Slot", 20, yPosition);
    yPosition += 10;

    timeTables.forEach((timeTable) => {
      doc.text(
        `${timeTable.moduleCode} | ${timeTable.moduleName} | ${timeTable.lectureName} | ${timeTable.room} | ${timeTable.timeSlot}`,
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

      {/* Add/Edit Time Table Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {editingTimeTable ? "Edit Time Table" : "Add New Time Table"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            type="text"
            name="room"
            value={form.room}
            onChange={handleChange}
            placeholder="Room"
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="text"
            name="timeSlot"
            value={form.timeSlot}
            onChange={handleChange}
            placeholder="Time Slot"
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors sm:col-span-2"
          >
            {editingTimeTable ? "Update Time Table" : "Add Time Table"}
          </button>
        </form>
      </div>

      {/* Time Table List Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Time Table List</h2>
        <div className="mb-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search time tables..."
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
              <th className="py-3 px-6 text-left">Module Code</th>
              <th className="py-3 px-6 text-left">Module Name</th>
              <th className="py-3 px-6 text-left">Lecture Name</th>
              <th className="py-3 px-6 text-left">Room</th>
              <th className="py-3 px-6 text-left">Time Slot</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {timeTables
              .filter((timeTable) =>
                timeTable.moduleName.toLowerCase().includes(search.toLowerCase())
              )
              .map((timeTable) => (
                <tr key={timeTable._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">{timeTable.moduleCode}</td>
                  <td className="py-3 px-6">{timeTable.moduleName}</td>
                  <td className="py-3 px-6">{timeTable.lectureName}</td>
                  <td className="py-3 px-6">{timeTable.room}</td>
                  <td className="py-3 px-6">{timeTable.timeSlot}</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => handleEdit(timeTable)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(timeTable._id)}
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

export default TimeTableManagement;
