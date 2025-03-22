const express = require("express");
const { detectConflicts } = require("../Controllers/conflictController");

const router = express.Router();

router.get("/detect", detectConflicts);

module.exports = router;
