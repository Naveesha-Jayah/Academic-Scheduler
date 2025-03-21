const mongoose = require("mongoose");
const { Schema } = mongoose;

const resourceSchema = new Schema({
    roomName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    computers: {
        type: Number,
        required: true
    },
    projectors: {
        type: Number,
        required: true
    },
    whiteboards: {
        type: Number,
        required: true
    },
    presentationSystem: {
        type: Boolean,
        required: true
    },
    chair: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Resource", resourceSchema);
