const express = require("express");
const router = express.Router();

const resourceController = require("../Controllers/resourceController");
const resourceModel = require("../Model/resourceModel");

router.get("/", resourceController.getResource);
router.post("/", resourceController.addResource);
router.get("/:id", resourceController.getResourceById); 
router.put("/:id", resourceController.updateResource);
router.delete("/:id", resourceController.deleteResource);

module.exports = router;