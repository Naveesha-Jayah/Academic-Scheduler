const Schedule = require("../Model/schedule");
const Conflict = require("../Model/conflictModel");

// Detect conflicts
exports.detectConflicts = async (req, res) => {
    try {
        const schedules = await Schedule.find().populate("lecturer room");
        let conflicts = [];

        for (let i = 0; i < schedules.length; i++) {
            for (let j = i + 1; j < schedules.length; j++) {
                let s1 = schedules[i];
                let s2 = schedules[j];

                if (s1.room._id.equals(s2.room._id) &&
                    ((s1.startTime < s2.endTime && s1.endTime > s2.startTime))) {
                    conflicts.push({ schedule1: s1._id, schedule2: s2._id, conflictType: "Room" });
                }

                if (s1.lecturer._id.equals(s2.lecturer._id) &&
                    ((s1.startTime < s2.endTime && s1.endTime > s2.startTime))) {
                    conflicts.push({ schedule1: s1._id, schedule2: s2._id, conflictType: "Lecturer" });
                }
            }
        }

        await Conflict.insertMany(conflicts);
        res.status(200).json({ message: "Conflicts detected", conflicts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
