import React, { useEffect, useState } from "react";
import axiosInstance from "../../Lib/axios";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Import the autoTable plugin

const ResourceManagement = () => {
  const [resources, setResources] = useState([]); // Ensure initial state is an array
  const [form, setForm] = useState({
    roomName: "",
    type: "",
    computers: "",
    projectors: "",
    whiteboards: "",
    presentationSystem: false,
    chair: "",
  });
  const [editingResource, setEditingResource] = useState(null);
  const [search, setSearch] = useState("");
  const [rooms, setRooms] = useState([]); // For storing room names
  const [errors, setErrors] = useState({}); // To handle validation errors
  const [filterType, setFilterType] = useState("all"); // New state for filtering by room type

  useEffect(() => {
    fetchResources();
    fetchRooms(); // Fetch rooms to populate the dropdown
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

  const fetchRooms = async () => {
    try {
      const response = await axiosInstance.get("/api/room");
      console.log("Fetched Rooms:", response.data); // Debugging
      setRooms(response.data); // Store rooms data
    } catch (error) {
      console.error("Error fetching rooms", error);
      setRooms([]); // Prevent empty dropdown if error occurs
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Allow only numbers for specific fields
    if (["computers", "projectors", "whiteboards", "chair"].includes(name)) {
      // Use a regular expression to allow only digits (0-9)
      if (!/^\d*$/.test(value)) {
        return; // Do not update the state if the value is not a number
      }
    }

    setForm({
      ...form,
      [name]: type === "checkbox" ? e.target.checked : value,
    });

    // Clear the error for the field when it changes
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }

    // If roomName changes, auto-populate the type
    if (name === "roomName") {
      const selectedRoom = rooms.find((room) => room.roomName === value);
      if (selectedRoom) {
        setForm((prevForm) => ({
          ...prevForm,
          type: selectedRoom.type, // Auto-populate the type
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate that fields contain only numbers
    const numberFields = ["computers", "projectors", "whiteboards", "chair"];
    numberFields.forEach((field) => {
      if (!/^\d+$/.test(form[field])) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be a number.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }

    // Check if the room name already exists
    const duplicateRoom = resources.find((resource) => resource.roomName === form.roomName);
    if (duplicateRoom) {
      alert("This room name already exists! Please select a different room.");
      return;
    }

    try {
      if (editingResource) {
        await axiosInstance.put(`/api/resource/${editingResource._id}`, form);
      } else {
        await axiosInstance.post("/api/resource", form);
      }
      setForm({
        roomName: "",
        type: "",
        computers: "",
        projectors: "",
        whiteboards: "",
        presentationSystem: false,
        chair: "",
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

    // Add title to the PDF
    doc.setFontSize(18);
    doc.text("Resource List Report", 20, 20);

    // Define the columns for the table
    const columns = [
      "Room Name",
      "Type",
      "Computers",
      "Projectors",
      "Whiteboards",
      "Presentation",
      "Chairs",
    ];

    // Map the resources data to the table rows
    const rows = resources.map((resource) => [
      resource.roomName,
      resource.type,
      resource.computers,
      resource.projectors,
      resource.whiteboards,
      resource.presentationSystem ? "Yes" : "No",
      resource.chair,
    ]);

    // Generate the table using autoTable
    doc.autoTable({
      startY: 30, // Start the table below the title
      head: [columns], // Table header
      body: rows, // Table data
    });

    // Save the PDF
    doc.save("resource_report.pdf");
  };

  // Filter resources based on search and selected type
  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.roomName.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || resource.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Resource Management</h1>

      {/* Add Resource Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add or Edit Resource</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Room Name dropdown */}
          <select
            name="roomName"
            value={form.roomName}
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 rounded-md"
            required
          >
            <option value="" disabled>Select Room</option>
            {rooms.map((room) => (
              <option key={room._id} value={room.roomName}>
                {room.roomName}
              </option>
            ))}
          </select>

          {/* Type field (auto-populated) */}
          <input
            type="text"
            name="type"
            value={form.type}
            onChange={handleChange}
            placeholder="Type"
            className="border-2 border-gray-300 p-3 rounded-md"
            required
            readOnly // Make it read-only since it's auto-populated
          />

          {/* Computers field */}
          <div>
            <input
              type="text" // Changed to text to handle input validation
              name="computers"
              value={form.computers}
              onChange={handleChange}
              placeholder="Computers"
              className="border-2 border-gray-300 p-3 rounded-md w-full"
              required
            />
            {errors.computers && (
              <p className="text-red-500 text-sm mt-1">{errors.computers}</p>
            )}
          </div>

          {/* Projectors field */}
          <div>
            <input
              type="text" // Changed to text to handle input validation
              name="projectors"
              value={form.projectors}
              onChange={handleChange}
              placeholder="Projectors"
              className="border-2 border-gray-300 p-3 rounded-md w-full"
              required
            />
            {errors.projectors && (
              <p className="text-red-500 text-sm mt-1">{errors.projectors}</p>
            )}
          </div>

          {/* Whiteboards field */}
          <div>
            <input
              type="text" // Changed to text to handle input validation
              name="whiteboards"
              value={form.whiteboards}
              onChange={handleChange}
              placeholder="Whiteboards"
              className="border-2 border-gray-300 p-3 rounded-md w-full"
              required
            />
            {errors.whiteboards && (
              <p className="text-red-500 text-sm mt-1">{errors.whiteboards}</p>
            )}
          </div>

          {/* Chairs field */}
          <div>
            <input
              type="text" // Changed to text to handle input validation
              name="chair"
              value={form.chair}
              onChange={handleChange}
              placeholder="Chairs"
              className="border-2 border-gray-300 p-3 rounded-md w-full"
              required
            />
            {errors.chair && (
              <p className="text-red-500 text-sm mt-1">{errors.chair}</p>
            )}
          </div>

          {/* Presentation System checkbox */}
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

          {/* Submit button */}
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
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border-2 border-gray-300 p-3 rounded-md"
          >
            <option value="all">All Rooms</option>
            <option value="Lecture Room">Lecture Rooms</option>
            <option value="Lab Room">Lab Rooms</option>
          </select>
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
              <th className="py-3 px-6 text-left">Chairs</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResources.map((resource) => (
              <tr key={resource._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">{resource.roomName}</td>
                <td className="py-3 px-6">{resource.type}</td>
                <td className="py-3 px-6">{resource.computers}</td>
                <td className="py-3 px-6">{resource.projectors}</td>
                <td className="py-3 px-6">{resource.whiteboards}</td>
                <td className="py-3 px-6">{resource.presentationSystem ? "Yes" : "No"}</td>
                <td className="py-3 px-6">{resource.chair}</td>
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