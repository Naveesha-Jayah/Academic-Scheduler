import { useState, useEffect } from "react";

export default function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("");
  const [editingRoomId, setEditingRoomId] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const response = await fetch("/api/rooms");
    const data = await response.json();
    setRooms(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingRoomId ? "PUT" : "POST";
    const url = editingRoomId ? `/api/rooms/${editingRoomId}` : "/api/rooms";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomName, type, capacity, availabilityStatus }),
    });

    if (response.ok) {
      fetchRooms();
      setRoomName("");
      setType("");
      setCapacity("");
      setAvailabilityStatus("");
      setEditingRoomId(null);
    }
  };

  const handleEdit = (room) => {
    setEditingRoomId(room._id);
    setRoomName(room.roomName);
    setType(room.type);
    setCapacity(room.capacity);
    setAvailabilityStatus(room.availabilityStatus);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      await fetch(`/api/rooms/${id}`, { method: "DELETE" });
      fetchRooms();
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-xl font-bold">{editingRoomId ? "Edit Room" : "Add New Room"}</h2>
      <form className="flex flex-col gap-4 p-4 bg-gray-800 rounded" onSubmit={handleSubmit}>
        <input type="text" placeholder="Room Name" className="p-2 rounded bg-gray-700" value={roomName} onChange={(e) => setRoomName(e.target.value)} required />
        <input type="text" placeholder="Type" className="p-2 rounded bg-gray-700" value={type} onChange={(e) => setType(e.target.value)} required />
        <input type="number" placeholder="Capacity" className="p-2 rounded bg-gray-700" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
        <input type="text" placeholder="Availability Status" className="p-2 rounded bg-gray-700" value={availabilityStatus} onChange={(e) => setAvailabilityStatus(e.target.value)} required />
        <button type="submit" className="p-2 bg-blue-600 rounded">
          {editingRoomId ? "Update Room" : "Add Room"}
        </button>
      </form>

      <h2 className="text-xl font-bold mt-6">Room List</h2>
      <table className="w-full mt-4 bg-gray-800 rounded">
        <thead>
          <tr className="text-left bg-gray-700">
            <th className="p-2">Room Name</th>
            <th className="p-2">Type</th>
            <th className="p-2">Capacity</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room._id} className="border-t border-gray-700">
              <td className="p-2">{room.roomName}</td>
              <td className="p-2">{room.type}</td>
              <td className="p-2">{room.capacity}</td>
              <td className="p-2">{room.availabilityStatus}</td>
              <td className="p-2">
                <button className="p-1 bg-yellow-500 text-black rounded mx-1" onClick={() => handleEdit(room)}>
                  Edit
                </button>
                <button className="p-1 bg-red-600 text-white rounded mx-1" onClick={() => handleDelete(room._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
