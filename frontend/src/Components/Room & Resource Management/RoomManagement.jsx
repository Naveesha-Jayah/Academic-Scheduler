import React, { useState } from "react";

const RoomManagement = () => {
  const [formData, setFormData] = useState({
    roomName: "",
    type: "",
    capacity: "",
    availabilityStatus: "",
  });

  const [rooms, setRooms] = useState([
    { id: 1, roomName: "Room A", type: "Conference", capacity: "10", availabilityStatus: "Available" },
    { id: 2, roomName: "Room B", type: "Meeting", capacity: "5", availabilityStatus: "Occupied" },
  ]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddRoom = () => {
    setRooms([...rooms, { id: rooms.length + 1, ...formData }]);
    setFormData({ roomName: "", type: "", capacity: "", availabilityStatus: "" });
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-xl font-bold mb-4">Room Management</h2>
      
      {/* Add/Edit Room Form */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-2">Add or Edit Room</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="roomName"
            placeholder="Room Name"
            value={formData.roomName}
            onChange={handleInputChange}
            className="p-2 rounded border border-gray-600 bg-gray-700"
          />
          <input
            type="text"
            name="type"
            placeholder="Type"
            value={formData.type}
            onChange={handleInputChange}
            className="p-2 rounded border border-gray-600 bg-gray-700"
          />
          <input
            type="text"
            name="capacity"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={handleInputChange}
            className="p-2 rounded border border-gray-600 bg-gray-700"
          />
          <input
            type="text"
            name="availabilityStatus"
            placeholder="Availability Status"
            value={formData.availabilityStatus}
            onChange={handleInputChange}
            className="p-2 rounded border border-gray-600 bg-gray-700"
          />
        </div>
        <button
          onClick={handleAddRoom}
          className="mt-4 w-full bg-purple-600 p-2 rounded text-white font-semibold"
        >
          Add Room
        </button>
      </div>

      {/* Room List */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Room List</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-2">Room Name</th>
              <th className="p-2">Type</th>
              <th className="p-2">Capacity</th>
              <th className="p-2">Availability</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-t border-gray-600">
                <td className="p-2">{room.roomName}</td>
                <td className="p-2">{room.type}</td>
                <td className="p-2">{room.capacity}</td>
                <td className="p-2">{room.availabilityStatus}</td>
                <td className="p-2">
                  <button className="bg-yellow-500 px-3 py-1 rounded text-white mr-2">Edit</button>
                  <button className="bg-red-600 px-3 py-1 rounded text-white">Delete</button>
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
