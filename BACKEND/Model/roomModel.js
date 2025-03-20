const mongoose = require("mongoose");
const { Schema } = mongoose;

const roomSchema = new Schema({
    roomName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    availabilityStatus: {
        type: Boolean,
        required: true
    },
});

module.exports = mongoose.model("Room", roomSchema);
