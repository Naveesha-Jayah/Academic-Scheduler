const Conflict = require("../Model/conflictModel");
const Schedule = require("../Model/schedule");

// Resolve conflicts using AI logic
exports.resolveConflicts = async (req, res) => {
    try {
        const conflicts = await Conflict.find({ resolved: false }).populate("schedule1 schedule2");

        for (const conflict of conflicts) {
            let newTime = new Date(conflict.schedule1.endTime);
            newTime.setMinutes(newTime.getMinutes() + 30); // Add 30 mins buffer

            await Schedule.findByIdAndUpdate(conflict.schedule2._id, { startTime: newTime });
            await Conflict.findByIdAndUpdate(conflict._id, { resolved: true });
        }

        res.status(200).json({ message: "Conflicts resolved using AI!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
