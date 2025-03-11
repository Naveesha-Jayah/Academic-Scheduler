const express = require("express");
const mongoose = require ("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
require("dotenv").config();


const timeTableRoute = require("./Route/timeTableRoute");



const app = express();

app.use(cors());
app.use(express.json());

//middleware

app.use("/timeTable", timeTableRoute);

//database connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB ✅");
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT} 🚀`);
    });
})
.catch((err) => console.log("MongoDB Connection Error ❌:", err));
