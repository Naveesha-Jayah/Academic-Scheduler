const Room = require("../Model/roomModel");

// Get all rooms
const getRoom = async (req, res) => {
    try {
        const roomData = await Room.find();
        if (!roomData.length) {
            return res.status(404).json({ message: "No rooms found" });
        }
        return res.status(200).json(roomData);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get room by ID
const getRoomById = async (req, res) => {
    try {
        const roomData = await Room.findById(req.params.id);
        if (!roomData) {
            return res.status(404).json({ message: "Room not found" });
        }
        return res.status(200).json(roomData);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Add a new room
const addRoom = async (req, res) => {
    try {
        const { roomName, type, capacity, availabilityStatus } = req.body;

        // Validation
        if (!roomName || !type || !capacity || availabilityStatus === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newRoom = new Room({ roomName, type, capacity, availabilityStatus });
        await newRoom.save();
        return res.status(201).json(newRoom);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Update room details
const updateRoom = async (req, res) => {
    try {
        const { roomName, type, capacity, availabilityStatus } = req.body;
        const roomData = await Room.findByIdAndUpdate(
            req.params.id,
            { roomName, type, capacity, availabilityStatus },
            { new: true, runValidators: true }
        );

        if (!roomData) {
            return res.status(404).json({ message: "Room not found" });
        }
        return res.status(200).json(roomData);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Delete a room
const deleteRoom = async (req, res) => {
    try {
        const roomData = await Room.findByIdAndDelete(req.params.id);
        if (!roomData) {
            return res.status(404).json({ message: "Room not found" });
        }
        return res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { getRoom, getRoomById, addRoom, updateRoom, deleteRoom };
