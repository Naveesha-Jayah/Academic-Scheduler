import React, { useEffect, useState } from "react";
import axiosInstance from "../../Lib/axios";
import jsPDF from "jspdf";
// import "jspdf-autotable";

const ResourceManagement = () => {
  const [resources, setResources] = useState([]); // Ensure initial state is an array
  const [form, setForm] = useState({
    roomName: "",
    type: "",
    computers: 0,
    projectors: 0,
    whiteboards: 0,
    presentationSystem: false,
  });
  const [editingResource, setEditingResource] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axiosInstance.get("/api/resource");
      console.log("Fetched Resources:", response.data); // Debugging
      setResources(Array.isArray(response.data) ? response.data : []); // Ensure array
    } catch (error) {
      console.error("Error fetching resources", error);
      setResources([]); // Prevent filter errors
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? e.target.checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingResource) {
        await axiosInstance.put(`/api/resource/${editingResource._id}`, form);
      } else {
        await axiosInstance.post("/api/resource", form);
      }
      setForm({
        roomName: "",
        type: "",
        computers: 0,
        projectors: 0,
        whiteboards: 0,
        presentationSystem: false,
      });
      setEditingResource(null);
      fetchResources();
    } catch (error) {
      console.error("Error saving resource", error);
    }
  };

  const handleEdit = (resource) => {
    setForm(resource);
    setEditingResource(resource);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/resource/${id}`);
      fetchResources();
    } catch (error) {
      console.error("Error deleting resource", error);
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Resource List Report", 20, 20);
    doc.autoTable({
      startY: 30,
      head: [["Room Name", "Type", "Computers", "Projectors", "Whiteboards", "Presentation"]],
      body: resources.map((resource) => [
        resource.roomName,
        resource.type,
        resource.computers,
        resource.projectors,
        resource.whiteboards,
        resource.presentationSystem ? "Yes" : "No",
      ]),
    });
    doc.save("resource_report.pdf");
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Resource Management</h1>

      {/* Add Resource Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add or Edit Resource</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input
            type="text"
            name="roomName"
            value={form.roomName}
            onChange={handleChange}
            placeholder="Room Name"
            className="border-2 border-gray-300 p-3 rounded-md"
            required
          />
          <input
            type="text"
            name="type"
            value={form.type}
            onChange={handleChange}
            placeholder="Type"
            className="border-2 border-gray-300 p-3 rounded-md"
            required
          />
          <input
            type="number"
            name="computers"
            value={form.computers}
            onChange={handleChange}
            placeholder="Computers"
            className="border-2 border-gray-300 p-3 rounded-md"
            required
          />
          <input
            type="number"
            name="projectors"
            value={form.projectors}
            onChange={handleChange}
            placeholder="Projectors"
            className="border-2 border-gray-300 p-3 rounded-md"
            required
          />
          <input
            type="number"
            name="whiteboards"
            value={form.whiteboards}
            onChange={handleChange}
            placeholder="Whiteboards"
            className="border-2 border-gray-300 p-3 rounded-md"
            required
          />
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="presentationSystem"
              checked={form.presentationSystem}
              onChange={handleChange}
              className="h-5 w-5 text-indigo-600"
            />
            <span className="text-gray-700">Has Presentation System</span>
          </label>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 sm:col-span-2"
          >
            {editingResource ? "Update Resource" : "Add Resource"}
          </button>
        </form>
      </div>

      {/* Resource List Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Resource List</h2>
        <div className="mb-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search resources..."
            className="border-2 border-gray-300 p-3 w-2/3 rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={generateReport}
            className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600"
          >
            Generate Report
          </button>
        </div>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-indigo-100 text-gray-700">
              <th className="py-3 px-6 text-left">Room Name</th>
              <th className="py-3 px-6 text-left">Type</th>
              <th className="py-3 px-6 text-left">Computers</th>
              <th className="py-3 px-6 text-left">Projectors</th>
              <th className="py-3 px-6 text-left">Whiteboards</th>
              <th className="py-3 px-6 text-left">Presentation</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(resources) &&
              resources
                .filter((resource) =>
                  resource.roomName.toLowerCase().includes(search.toLowerCase())
                )
                .map((resource) => (
                  <tr key={resource._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-6">{resource.roomName}</td>
                    <td className="py-3 px-6">{resource.type}</td>
                    <td className="py-3 px-6">{resource.computers}</td>
                    <td className="py-3 px-6">{resource.projectors}</td>
                    <td className="py-3 px-6">{resource.whiteboards}</td>
                    <td className="py-3 px-6">{resource.presentationSystem ? "Yes" : "No"}</td>
                    <td className="py-3 px-6">
                      <button onClick={() => handleEdit(resource)} className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 mr-2">Edit</button>
                      <button onClick={() => handleDelete(resource._id)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourceManagement;
