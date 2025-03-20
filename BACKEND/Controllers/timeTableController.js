const TimeTable = require("../Model/timeTableModel");

const getTimeTable = async (req, res, next) => {
  try {
    const timeTableData = await TimeTable.find();
    if (!timeTableData || timeTableData.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(timeTableData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const addTimeTable = async (req, res, next) => {
  const {
    year,
    semester,
    moduleCode,
    moduleName,
    lectureName,
    room,
    timeSlot,
    day,
  } = req.body;

  // Log the incoming data to check if day is passed correctly
  console.log(req.body);

  try {
    const timeTableData = new TimeTable({
      year,
      semester,
      moduleCode,
      moduleName,
      lectureName,
      room,
      timeSlot,
      day,
    });
    await timeTableData.save();
    return res.status(201).json(timeTableData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error saving timetable" });
  }
};

const getTimeTableById = async (req, res, next) => {
  const timeTableId = req.params.id;
  try {
    const timeTableData = await TimeTable.findById(timeTableId);
    if (!timeTableData) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(timeTableData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateTimeTable = async (req, res, next) => {
  const timeTableId = req.params.id;
  const {
    moduleCode,
    moduleName,
    lectureName,
    room,
    timeSlot,
    day,
    year,
    semester,
  } = req.body;
  
  try {
    let timeTableData = await TimeTable.findByIdAndUpdate(
      timeTableId,
      {
        year,
        semester,
        moduleCode,
        moduleName,
        lectureName,
        room,
        timeSlot,
        day,
      },
      { new: true }
    );

    if (!timeTableData) {
      return res.status(404).json({ message: "No data found to update" });
    }
    return res.status(200).json(timeTableData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error updating timetable" });
  }
};

const deleteTimeTable = async (req, res, next) => {
  const timeTableId = req.params.id;
  try {
    const timeTableData = await TimeTable.findByIdAndDelete(timeTableId);
    if (!timeTableData) {
      return res.status(404).json({ message: "No data found to delete" });
    }
    return res.status(200).json(timeTableData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error deleting timetable" });
  }
};

exports.getTimeTable = getTimeTable;
exports.addTimeTable = addTimeTable;
exports.getTimeTableById = getTimeTableById;
exports.updateTimeTable = updateTimeTable;
exports.deleteTimeTable = deleteTimeTable;
