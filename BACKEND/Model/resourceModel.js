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
    computers: { // Changed to lowercase for consistency
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
        type: Boolean, // Boolean makes more sense if it's a yes/no feature
        required: true
    }
});

module.exports = mongoose.model("Resource", resourceSchema);
