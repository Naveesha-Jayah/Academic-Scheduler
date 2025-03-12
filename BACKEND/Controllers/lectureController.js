const Lecture = require("../Model/lectureModel");

// Get all lectures
const getAllLectures = async (req, res, next) => {
    let lectureData;
    try {
        lectureData = await Lecture.find();
    } catch (error) {
        console.log(error);
    }

    if (!lectureData) {
        return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(lectureData);
};

// Create a new lecture
const addLecture = async (req, res, next) => {
    const { lectureID, lectureName, email, moduleName } = req.body;
    let lectureData;
    
    try {
        lectureData = new Lecture({ lectureID, lectureName, email, moduleName });
        await lectureData.save();
    } catch (error) {
        console.log(error);
    }

    if (!lectureData) {
        return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(lectureData);
};

// Get a single lecture by ID
const getLectureById = async (req, res, next) => {
    const lecId = req.params.id;
    let lectureData;
    
    try {
        lectureData = await Lecture.findById(lecId);
    } catch (error) {
        console.log(error);
    }

    if (!lectureData) {
        return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(lectureData);
};

// Update a lecture by ID
const updateLecture = async (req, res, next) => {
    const lecId = req.params.id;
    const { lectureID, lectureName, email, moduleName } = req.body;
    let lectureData;
    
    try {
        lectureData = await Lecture.findByIdAndUpdate(lecId, { lectureID, lectureName, email, moduleName });
        lectureData = await Lecture.save();
    } catch (error) {
        console.log(error);
    }

    if (!lectureData) {
        return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(lectureData);
};

// Delete a lecture by ID
const deleteLecture = async (req, res, next) => {
    const lecId = req.params.id;
    let lectureData;
    
    try {
        lectureData = await Lecture.findByIdAndDelete(lecId);
    } catch (error) {
        console.log(error);
    }

    if (!lectureData) {
        return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(lectureData);
};

// Export functions
exports.getAllLectures = getAllLectures;
exports.addLecture = addLecture;
exports.getLectureById = getLectureById;
exports.updateLecture = updateLecture;
exports.deleteLecture = deleteLecture;
