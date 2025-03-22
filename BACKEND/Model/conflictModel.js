const mongoose = require("mongoose");

const ConflictSchema = new mongoose.Schema({
    schedule1: { type: mongoose.Schema.Types.ObjectId, ref: "schedule", required: true },
    schedule2: { type: mongoose.Schema.Types.ObjectId, ref: "schedule", required: true },
    conflictType: { type: String, enum: ["Room", "Lecturer", "Time"], required: true },
    resolved: { type: Boolean, default: false }
});

module.exports = mongoose.model("Conflict", ConflictSchema);
