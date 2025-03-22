const express = require("express");
const { registerUser, loginUser  } = require("../Controllers/userController"); // Import controller

const router = express.Router();

router.post("/register", registerUser); // Use controller function
router.post("/login", loginUser);

module.exports = router;
