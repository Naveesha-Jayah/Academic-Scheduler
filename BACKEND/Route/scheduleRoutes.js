const express = require("express");
const router = express.Router();
const { addSchedule, getAllSchedules, detectConflicts, resolveConflicts } = require("../Controllers/scheduleController");

// Define routes and link them to the controller
router.post("/add", addSchedule);
router.get("/all", getAllSchedules);
router.get("/detect-conflicts", detectConflicts);
router.get("/resolve-conflicts", resolveConflicts);

module.exports = router;
