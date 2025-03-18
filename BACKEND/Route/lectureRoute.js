const express = require("express");
const {
    getAllLectures,
    addLecture,
    getLectureById,
    updateLecture,
    deleteLecture
} = require("../Controllers/lectureController");

const router = express.Router();

router.post("/", addLecture);
router.get("/", getAllLectures);
router.get("/:id", getLectureById);
router.put("/:id", updateLecture);
router.delete("/:id", deleteLecture);

module.exports = router;
