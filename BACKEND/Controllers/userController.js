const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");
const jwtSecret = process.env.JWT_SECRET || "default_secret_key";

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    console.log("Received Data:", { name, email, password }); // Debugging log

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.loginUser = async (req, res) => {
    console.log("Received login request:", req.body); // Debugging log


    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

         // ✅ Generate JWT Token
         const token = jwt.sign({ id: user._id, email: user.email }, jwtSecret, { expiresIn: "1h" });


        res.json({ 
            message: "Login successful", 
            token,
            user: { id: user._id, name: user.name, email: user.email } 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
