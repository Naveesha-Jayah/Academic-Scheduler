const express = require("express");
const mongoose = require ("mongoose");

const dotenv = require("dotenv");
require("dotenv").config();



const app = express();

//middleware
app.use("/",(req,res,next)=>{
    res.send("It is working");
})

//database connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB ✅");
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT} 🚀`);
    });
})
.catch((err) => console.log("MongoDB Connection Error ❌:", err));
