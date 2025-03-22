const Schedule = require("../Model/schedule");

// Add a new schedule
const addSchedule = async (req, res) => {
    try {
        const newSchedule = new Schedule(req.body);
        await newSchedule.save();
        res.status(201).json({ message: "Schedule Added" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all schedules
const getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find();
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Detect conflicts
const detectConflicts = async (req, res) => {
    try {
        const schedules = await Schedule.find();
        let conflicts = [];

        for (let i = 0; i < schedules.length; i++) {
            for (let j = i + 1; j < schedules.length; j++) {
                if (
                    schedules[i].date === schedules[j].date &&
                    schedules[i].room === schedules[j].room &&
                    ((schedules[i].startTime >= schedules[j].startTime &&
                      schedules[i].startTime < schedules[j].endTime) ||
                     (schedules[j].startTime >= schedules[i].startTime &&
                      schedules[j].startTime < schedules[i].endTime))
                ) {
                    conflicts.push({
                        schedule1: schedules[i],
                        schedule2: schedules[j],
                        issue: "Room Conflict",
                    });
                }
            }
        }

        res.json(conflicts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// AI Conflict Resolution - Suggest Alternative Schedules
const resolveConflicts = async (req, res) => {
    try {
        const schedules = await Schedule.find();
        let conflicts = [];

        for (let i = 0; i < schedules.length; i++) {
            for (let j = i + 1; j < schedules.length; j++) {
                if (
                    schedules[i].date === schedules[j].date &&
                    schedules[i].room === schedules[j].room &&
                    ((schedules[i].startTime >= schedules[j].startTime &&
                      schedules[i].startTime < schedules[j].endTime) ||
                     (schedules[j].startTime >= schedules[i].startTime &&
                      schedules[j].startTime < schedules[i].endTime))
                ) {
                    let newTime = (parseInt(schedules[j].endTime.split(":")[0]) + 1) + ":00";
                    conflicts.push({
                        schedule1: schedules[i],
                        schedule2: schedules[j],
                        issue: "Room Conflict",
                        suggestedSolution: `Move ${schedules[j].courseName} to ${newTime}`,
                    });
                }
            }
        }

        res.json(conflicts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { addSchedule, getAllSchedules, detectConflicts, resolveConflicts };
