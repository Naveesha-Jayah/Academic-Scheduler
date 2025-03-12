const mongoose = require ("mongoose")
const schema = mongoose.Schema

const timeTableSchema = new schema({

    moduleCode: {
        type: String,
        required: true
    },
    moduleName:{
        type: String,
        required: true
    },
    lectureName: {
        type: String,
        required: true
    },
    room:{
        type: String,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },

})

module.exports = mongoose.model("timeTableModel", timeTableSchema)
