const express = require("express");
const router = express.Router();
const roomController = require("../Controllers/roomController");

router.get("/", roomController.getRoom);
router.get("/:id", roomController.getRoomById);
router.post("/", roomController.addRoom);
router.put("/:id", roomController.updateRoom);
router.delete("/:id", roomController.deleteRoom);

module.exports = router;
