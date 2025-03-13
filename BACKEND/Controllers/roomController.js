const room = require("../Model/roomModel")


const getRoom = async (req, res , next) => {
    let roomData;
    try{
        roomData = await room.find();
    } catch (error) {
        console.log(error);
    }

    if (!roomData) {
        return res.status(404).json({ message: "No data found" });
    }

    return res.status(200).json(roomData);
};

const addRoom = async (req, res , next) => {
    const {roomName} = req.body;
    let roomData;
    try{
        roomData = new room({roomName});
        await roomData.save();
    } catch (error) {
        console.log(error);
    }

    if (!roomData) {
        return res.status(404).json({ message: "No data found" });
    }

    return res.status(200).json(roomData);
};

const getRoomById = async (req, res, next) => {
    const roomId = req.params.id;
    let roomData;
    try{
        roomData = await room.findById(roomId);
    } catch (error) {
        console.log(error);
    }

    if (!roomData) {
        return res.status(404).json({ message: "No data found" });
    }

    return res.status(200).json(roomData);
};

const updateRoom = async (req, res, next) => {
    const roomId = req.params.id;
    const {roomName} = req.body;
    let roomData;
    try{
        roomData = await room.findByIdAndUpdate(roomId, {roomName});
        roomData = await roomData.save(); 
    } catch (error) {
        console.log(error);
    }

    if (!roomData) {
        return res.status(404).json({ message: "No data found" });
    } else {
        return res.status(200).json(roomData);
    }
};

const deleteRoom = async (req, res, next) => {
    const roomId = req.params.id;
    let roomData;
    try{
        roomData = await room.findByIdAndDelete(roomId);
    } catch (error) {
        console.log(error);
    }

    if (!roomData) {    
        return res.status(404).json({ message: "No data found" });
    } else {
        return res.status(200).json(roomData);
    }
};



exports.getRoom = getRoom;
exports.addRoom = addRoom;
exports.getRoomById = getRoomById;
exports.updateRoom = updateRoom;
exports.deleteRoom = deleteRoom;