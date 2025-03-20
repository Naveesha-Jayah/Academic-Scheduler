const express = require("express");
const router = express.Router();

const timeTableController = require("../Controllers/timeTableController");


router.get("/", timeTableController.getTimeTable);
router.post("/", timeTableController.addTimeTable);
router.get("/:id", timeTableController.getTimeTableById);
router.put("/:id", timeTableController.updateTimeTable);
router.delete("/:id", timeTableController.deleteTimeTable);

module.exports = router;