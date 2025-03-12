const express = require("express");
const router = express.Router();

const courseController = require("../Controllers/courseController");

router.get("/", courseController.getCourse);
router.post("/", courseController.addCourse);
router.get("/:id", courseController.getCourseById);
router.put("/:id", courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);

module.exports = router;
