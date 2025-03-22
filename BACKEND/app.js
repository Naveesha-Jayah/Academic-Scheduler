const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
require("dotenv").config();

const timeTableRoute = require("./Route/timeTableRoute");
const courseRoute = require("./Route/courseRoute");
const lectureRoute = require("./Route/lectureRoute");
const roomRoute = require("./Route/roomRoute");
const resourceRoute = require("./Route/resourceRoute");
const authRoute = require("./Route/authRoute");
const scheduleRoutes = require("./Route/scheduleRoutes");
const conflictRoutes = require("./Route/conflictRoutes");
const conflictResolutionRoutes = require("./Route/conflictResolutionRoutes");


const app = express();

app.use(cors());
app.use(express.json());

//middleware

app.use("/api/timeTable", timeTableRoute);
app.use("/api/course",courseRoute);
app.use("/api/lecture",lectureRoute);
app.use("/api/room",roomRoute);
app.use("/api/resource",resourceRoute);
app.use("/api/auth", authRoute);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/conflict", conflictRoutes);
app.use("/api/conflict-resolution", conflictResolutionRoutes);


//database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB ✅");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT} 🚀`);
    });
  })
  .catch((err) => console.log("MongoDB Connection Error ❌:", err));
