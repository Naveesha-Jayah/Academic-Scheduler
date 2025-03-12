const mongoose = require ("mongoose")
const schema = mongoose.Schema

const roomSchema = new schema({

    roomName: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    capacity: {
        type: String,
        required: true
    },

    availibilityStatus: {
        type: String,
        required: true
    },

    
})

module.exports = mongoose.model("roomModel", roomSchema)