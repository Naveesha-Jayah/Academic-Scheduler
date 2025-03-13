const mongoose = require ("mongoose")
const schema = mongoose.Schema

const resourceSchema = new schema({

    roomName: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    Computers: {
        type: String,
        required: true
    },

    projectors: {
        type: String,
        required: true
    },

    whiteboards: {
        type: String,
        required: true
    }, 

    presentationSystem: {
        type: String,
        required: true
    },

    
})

module.exports = mongoose.model("resourceModel", resourceSchema)