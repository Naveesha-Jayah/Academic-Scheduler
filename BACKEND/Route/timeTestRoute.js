const express   = require("express");
const router    = express.Router();

const timeTestController = require("../Controllers/timeTestController");

router.get("/", timeTestController.getTime);
router.post("/", timeTestController.addTime);
router.get("/:id", timeTestController.getTimeById);
router.put("/:id", timeTestController.updateTime);
router.delete("/:id", timeTestController.deleteTime);

module.exports = router;