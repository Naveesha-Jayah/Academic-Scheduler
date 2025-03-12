import React, { useState } from "react";

const RoomManagement = () => {
  const apiUrl = "http://localhost:5000/rooms"; // Adjust API endpoint as needed

  const [roomName, setRoomName] = useState("");
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [availability, setAvailability] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomData, setRoomData] = useState(null);
  const [updateRoomId, setUpdateRoomId] = useState("");
  const [updateRoomName, setUpdateRoomName] = useState("");
  const [deleteRoomId, setDeleteRoomId] = useState("");

  // Add Room
  const addRoom = async (e) => {
    e.preventDefault();
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomName, type, capacity, availibilityStatus: availability }),
    });

    if (response.ok) alert("Room Added Successfully");
    else alert("Error Adding Room");
  };

  // Get Room by ID
  const fetchRoomById = async () => {
    const response = await fetch(`${apiUrl}/${roomId}`);
    const data = await response.json();
    setRoomData(response.ok ? data : "Room Not Found");
  };

  // Update Room
  const updateRoom = async (e) => {
    e.preventDefault();
    const response = await fetch(`${apiUrl}/${updateRoomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomName: updateRoomName }),
    });

    if (response.ok) alert("Room Updated Successfully");
    else alert("Error Updating Room");
  };

  // Delete Room
  const deleteRoom = async () => {
    const response = await fetch(`${apiUrl}/${deleteRoomId}`, { method: "DELETE" });

    if (response.ok) alert("Room Deleted Successfully");
    else alert("Error Deleting Room");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Add Room</h2>
      <form onSubmit={addRoom}>
        <input type="text" placeholder="Room Name" value={roomName} onChange={(e) => setRoomName(e.target.value)} required />
        <input type="text" placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} required />
        <input type="text" placeholder="Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
        <input type="text" placeholder="Availability Status" value={availability} onChange={(e) => setAvailability(e.target.value)} required />
        <button type="submit">Add Room</button>
      </form>

      <h2>Get Room by ID</h2>
      <input type="text" placeholder="Enter Room ID" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
      <button onClick={fetchRoomById}>Get Room</button>
      {roomData && <p>{JSON.stringify(roomData)}</p>}

      <h2>Update Room</h2>
      <form onSubmit={updateRoom}>
        <input type="text" placeholder="Room ID" value={updateRoomId} onChange={(e) => setUpdateRoomId(e.target.value)} required />
        <input type="text" placeholder="New Room Name" value={updateRoomName} onChange={(e) => setUpdateRoomName(e.target.value)} required />
        <button type="submit">Update Room</button>
      </form>

      <h2>Delete Room</h2>
      <input type="text" placeholder="Enter Room ID" value={deleteRoomId} onChange={(e) => setDeleteRoomId(e.target.value)} />
      <button onClick={deleteRoom}>Delete Room</button>
    </div>
  );
};

export default RoomManagement;
