const timeTable = require("../Model/timeTableModel")

const getTimeTable = async (req, res , next) => {

    let timeTableData;
    try {
        timeTableData = await timeTable.find();
    } catch (error) {
        console.log(error);
    }

    if (!timeTableData) {
        return res.status(404).json({ message: "No data found" });
    }

    return res.status(200).json(timeTableData);



};

const addTimeTable = async (req, res , next) => {

    const {moduleCode, moduleName, lectureName, room, timeSlot} = req.body;
    let timeTableData;
    try{
        timeTableData = new timeTable({moduleCode, moduleName, lectureName, room, timeSlot});
        await timeTableData.save();
    } catch (error) {
        console.log(error);
    }

    if (!timeTableData) {
        return res.status(404).json({ message: "No data found" });
    }

    return res.status(200).json(timeTableData);
};

const getTimeTableById = async (req, res, next) => {
    const timeTableId = req.params.id;
    let timeTableData;
    try {
        timeTableData = await timeTable.findById(timeTableId);
    } catch (error) {
        console.log(error);
    }

    if (!timeTableData) {
        return res.status(404).json({ message: "No data found" });
    }

    return res.status(200).json(timeTableData);
};

const updateTimeTable = async (req, res, next) => {
    const timeTableId = req.params.id;
    const {moduleCode, moduleName, lectureName, room, timeSlot} = req.body;
    let timeTableData;
    try{
        timeTableData = await timeTable.findByIdAndUpdate(timeTableId, {moduleCode, moduleName, lectureName, room, timeSlot});
        timeTableData = await timeTableData.save(); 
    } catch (error) {
        console.log(error);
    }

    if (!timeTableData) {
        return res.status(404).json({ message: "No data found" });
    } else {
        return res.status(200).json(timeTableData);
    }
};

const deleteTimeTable = async (req, res, next) => {
    const timeTableId = req.params.id;
    let timeTableData;
    try{
        timeTableData = await timeTable.findByIdAndDelete(timeTableId);
    } catch (error) {
        console.log(error);
    }

    if (!timeTableData) {
        return res.status(404).json({ message: "No data found" });
    } else {
        return res.status(200).json(timeTableData);
    }
};



exports.getTimeTable = getTimeTable;
exports.addTimeTable = addTimeTable;
exports.getTimeTableById = getTimeTableById;
exports.updateTimeTable = updateTimeTable;
exports.deleteTimeTable = deleteTimeTable;