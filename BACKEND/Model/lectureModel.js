const mongoose = require("mongoose");
const { Schema } = mongoose;

const lectureSchema = new Schema({
    lectureID: {
        type: String,
        required: true,
        unique: true
    },
    lectureName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },
    moduleName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Lecture", lectureSchema);
