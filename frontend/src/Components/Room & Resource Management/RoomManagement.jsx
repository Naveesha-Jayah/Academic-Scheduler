import React, { useEffect, useState } from "react";
import axiosInstance from "../../Lib/axios";
import jsPDF from "jspdf";
// import "jspdf-autotable";

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]); // Ensure initial state is an array
  const [form, setForm] = useState({
    roomName: "",
    type: "",
    capacity: "",
    availabilityStatus: false,
  });
  const [editingRoom, setEditingRoom] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axiosInstance.get("/api/room");
      console.log("Fetched Rooms:", response.data); // Debugging
      setRooms(Array.isArray(response.data) ? response.data : []); // Ensure array
    } catch (error) {
      console.error("Error fetching rooms", error);
      setRooms([]); // Prevent filter errors
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
    doc.autoTable({
      startY: 30,
      head: [["Room Name", "Type", "Capacity", "Availability"]],
      body: rooms.map((room) => [
        room.roomName,
        room.type,
        room.capacity,
        room.availabilityStatus ? "Available" : "Unavailable",
      ]),
    });
    doc.save("room_report.pdf");
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Room Management</h1>

      {/* Add Room Form */}
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
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            placeholder="Capacity"
            className="border-2 border-gray-300 p-3 rounded-md"
            required
          />
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

      {/* Room List Table */}
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
            {Array.isArray(rooms) &&
              rooms
                .filter((room) =>
                  room.roomName.toLowerCase().includes(search.toLowerCase())
                  || room.type.toLowerCase().includes(search.toLowerCase())
                  || room.capacity.toString().includes(search)
                )
                .map((room) => (
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
