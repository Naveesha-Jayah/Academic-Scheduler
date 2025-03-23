import React, { useEffect, useState } from "react";
import axiosInstance from "../../Lib/axios";
import jsPDF from "jspdf";

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    roomName: "",
    type: "",
    capacity: "",
    availabilityStatus: false,
  });
  const [editingRoom, setEditingRoom] = useState(null);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({});
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axiosInstance.get("/api/room");
      setRooms(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching rooms", error);
      setRooms([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name === "capacity") {
      // Only allow numeric input for capacity and ensure it's not negative
      if (/^\d*$/.test(value) && value >= 0) {
        setForm({
          ...form,
          [name]: value,
        });
      }
    } else {
      setForm({
        ...form,
        [name]: type === "checkbox" ? e.target.checked : value,
      });
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (form.capacity <= 0 || isNaN(form.capacity)) {
      newErrors.capacity = "Capacity must be a positive number.";
    } else if (form.capacity < 0) {
      newErrors.capacity = "Capacity cannot be negative.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (editingRoom) {
        await axiosInstance.put(`/api/room/${editingRoom._id}`, form);
      } else {
        await axiosInstance.post("/api/room", form);
      }
      setForm({ roomName: "", type: "", capacity: "", availabilityStatus: false });
      setEditingRoom(null);
      fetchRooms();
    } catch (error) {
      console.error("Error saving room", error);
    }
  };

  const handleEdit = (room) => {
    setForm(room);
    setEditingRoom(room);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/room/${id}`);
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room", error);
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Room List Report", 20, 20);

    const columns = ["Room Name", "Type", "Capacity", "Availability"];
    const rows = rooms.map((room) => [
      room.roomName,
      room.type,
      room.capacity,
      room.availabilityStatus ? "Available" : "Unavailable",
    ]);

    doc.autoTable({
      startY: 30,
      head: [columns],
      body: rows,
    });

    doc.save("room_report.pdf");
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.roomName.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || room.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Room Management</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add or Edit Room</h2>
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
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 rounded-md"
            required
          >
            <option value="">Select Type</option>
            <option value="Lecture Room">Lecture Room</option>
            <option value="Lab Room">Lab Room</option>
          </select>
          <input
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            placeholder="Capacity"
            className="border-2 border-gray-300 p-3 rounded-md"
            required
            min="0"
          />
          {errors.capacity && (
            <p className="text-red-500 text-sm">{errors.capacity}</p>
          )}
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="availabilityStatus"
              checked={form.availabilityStatus}
              onChange={handleChange}
              className="h-5 w-5 text-indigo-600"
            />
            <span className="text-gray-700">Available</span>
          </label>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 sm:col-span-2"
          >
            {editingRoom ? "Update Room" : "Add Room"}
          </button>
        </form>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Room List</h2>
        <div className="mb-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search rooms..."
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
              <th className="py-3 px-6 text-left">Capacity</th>
              <th className="py-3 px-6 text-left">Availability</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map((room) => (
              <tr key={room._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">{room.roomName}</td>
                <td className="py-3 px-6">{room.type}</td>
                <td className="py-3 px-6">{room.capacity}</td>
                <td className="py-3 px-6">{room.availabilityStatus ? "Available" : "Unavailable"}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => handleEdit(room)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(room._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
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

export default RoomManagement;