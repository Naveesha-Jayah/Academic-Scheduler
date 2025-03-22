const express = require("express");
const { resolveConflicts } = require("../Controllers/conflictResolutionController");

const router = express.Router();

router.post("/resolve", resolveConflicts);

module.exports = router;
