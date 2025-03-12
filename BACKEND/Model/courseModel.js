const mongoose = require("mongoose");
const  schema = mongoose.Schema;

const courseSchema = new schema({

    year:{
        type: Number,
        required: true
    },

    semester:{
        type: Number,
        required: true
    },
    moduleCode: {
        type: String,
        required: true
    },
    moduleName:{
        type: String,
        required: true
    }



})
module.exports = mongoose.model("courseModel", courseSchema)
