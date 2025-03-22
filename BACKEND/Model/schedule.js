const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
    courseName: String,
    lecturer: String,
    room: String,
    date: String,
    startTime: String, // Format: "HH:MM"
    endTime: String,
});

module.exports = mongoose.model("schedule", ScheduleSchema);
