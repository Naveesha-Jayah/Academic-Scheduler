const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeSchema = new Schema({
  moduleCode: {
    type: String,
    required: true,
  },
  moduleName: {
    type: String,
    required: true,
  },
  lectureName: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], // Allow only valid days
  },
  year: {
    type: Number,
  },
  semester: {
    type: Number,
  },
});

module.exports = mongoose.model("Time", timeSchema);
