const Time = require("../Model/timeTestModel");

const getTime = async (req, res, next) => {
  try {
    const timeData = await Time.find();
    if (!timeData || timeData.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(timeData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const addTime = async (req, res, next) => {
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
    const timeData = new Time({
      year,
      semester,
      moduleCode,
      moduleName,
      lectureName,
      room,
      timeSlot,
      day,
    });
    await timeData.save();
    return res.status(201).json(timeData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error saving timetable" });
  }
};

const getTimeById = async (req, res, next) => {
  const timeId = req.params.id;
  try {
    const timeData = await Time.findById(timeId);
    if (!timeData) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(timeData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateTime = async (req, res, next) => {
  const timeId = req.params.id;
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
    let timeData = await Time.findByIdAndUpdate(
      timeId,
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

    if (!timeData) {
      return res.status(404).json({ message: "No data found to update" });
    }
    return res.status(200).json(timeData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error updating timetable" });
  }
};

const deleteTime = async (req, res, next) => {
  const timeId = req.params.id;
  try {
    const timeData = await Time.findByIdAndDelete(timeId);
    if (!timeData) {
      return res.status(404).json({ message: "No data found to delete" });
    }
    return res.status(200).json(timeData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error deleting timetable" });
  }
};

exports.getTime = getTime;
exports.addTime = addTime;
exports.getTimeById = getTimeById;
exports.updateTime = updateTime;
exports.deleteTime = deleteTime;
