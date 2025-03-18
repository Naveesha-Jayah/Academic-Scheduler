const express = require("express");
const router = express.Router();

const roomController = require("../Controllers/roomController");
const roomModel = require("../Model/roomModel");

router.get("/", roomController.getRoom);
router.post("/", roomController.addRoom);
router.get("/:id", roomController.getRoomById);
router.put("/:id", roomController.updateRoom);
router.delete("/:id", roomController.deleteRoom);

module.exports = router;