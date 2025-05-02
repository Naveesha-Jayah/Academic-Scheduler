import React, { useEffect, useState } from "react";
import axiosInstance from "../../Lib/axios";
import { motion, AnimatePresence } from "framer-motion";

const TIME_SLOTS = [
  "08:00 - 10:00", "09:00 - 12:00", "10:00 - 14:00", "11:00 - 15:00",
  "12:00", "13:00", "14:00", "15:00",
  "16:00 - 18:00", "17:00 - 19:00"
];

const ConflictList = () => {
  const [timeTables, setTimeTables] = useState([]);
  const [conflictsWithSuggestions, setConflictsWithSuggestions] = useState([]);
  const [isFixing, setIsFixing] = useState(false);
  const [fixSuccess, setFixSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTimeTables();
  }, []);

  const fetchTimeTables = async () => {
    try {
      const response = await axiosInstance.get("/api/timeTable");
      setTimeTables(response.data);
    } catch (error) {
      console.error("Error fetching time tables", error);
    }
  };

  useEffect(() => {
    if (timeTables.length > 0) {
      const enrichedConflicts = detectConflictsAndSuggest(timeTables);
      setConflictsWithSuggestions(enrichedConflicts);
    }
  }, [timeTables]);

  const detectConflictsAndSuggest = (entries) => {
    const conflicts = [];

    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const a = entries[i];
        const b = entries[j];

        if (a.day === b.day && a.timeSlot === b.timeSlot) {
          if (a.room === b.room || a.lectureName === b.lectureName) {
            const conflictType = a.room === b.room ? "Room Conflict" : "Lecture Conflict";
            const suggestions = [a, b].map((entry) => ({
              ...entry,
              suggestedRoom: suggestRoom(entry, entries),
              suggestedTime: suggestTimeSlot(entry, entries),
            }));

            conflicts.push({
              type: conflictType,
              message: `${conflictType} on ${a.day} at ${a.timeSlot}`,
              entries: suggestions,
            });
          }
        }
      }
    }

    return conflicts;
  };

  const suggestTimeSlot = (entry, allEntries) => {
    for (let slot of TIME_SLOTS) {
      const clash = allEntries.find(
        (e) =>
          e.day === entry.day &&
          e.timeSlot === slot &&
          (e.room === entry.room || e.lectureName === entry.lectureName)
      );
      if (!clash) return slot;
    }
    return "No alternative time available";
  };

  const suggestRoom = (entry, allEntries) => {
    const usedRooms = new Set(
      allEntries
        .filter((e) => e.day === entry.day && e.timeSlot === entry.timeSlot)
        .map((e) => e.room)
    );
    const allRooms = [...new Set(allEntries.map((e) => e.room))];
    return allRooms.find((room) => !usedRooms.has(room)) || "No available room";
  };

  const handleFixConflicts = async () => {
    setIsFixing(true);
    setShowModal(false);
    setFixSuccess("");

    // Clone current timetable to simulate progressive updates
    let updatedEntries = [...timeTables];

    try {
      for (const conflict of conflictsWithSuggestions) {
        for (const entry of conflict.entries) {
          if (
            entry.suggestedTime !== "No alternative time available" &&
            entry.suggestedRoom !== "No available room"
          ) {
            const alreadyConflict = updatedEntries.find(
              (e) =>
                e._id !== entry._id &&
                e.day === entry.day &&
                e.timeSlot === entry.suggestedTime &&
                (e.room === entry.suggestedRoom || e.lectureName === entry.lectureName)
            );

            if (!alreadyConflict) {
              await axiosInstance.put(`/api/timeTable/${entry._id}`, {
                ...entry,
                timeSlot: entry.suggestedTime,
                room: entry.suggestedRoom,
              });

              // Update local state to reflect the change
              updatedEntries = updatedEntries.map((e) =>
                e._id === entry._id
                  ? { ...e, timeSlot: entry.suggestedTime, room: entry.suggestedRoom }
                  : e
              );
            }
          }
        }
      }

      setFixSuccess("✅ All conflicts successfully fixed!");
      fetchTimeTables();
    } catch (err) {
      console.error("Error fixing conflicts", err);
      setFixSuccess("❌ Failed to fix some conflicts.");
    }

    setIsFixing(false);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
        Timetable Conflicts with Suggestions
      </h1>

      {conflictsWithSuggestions.length === 0 ? (
        <p className="text-green-600 text-center">No conflicts detected 🎉</p>
      ) : (
        <>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold mb-4 hover:bg-blue-700"
            disabled={isFixing}
          >
            {isFixing ? "Fixing..." : "Fix Conflicts Automatically"}
          </button>

          {fixSuccess && (
            <p className="text-center text-lg font-medium text-green-700">{fixSuccess}</p>
          )}

          <div className="space-y-6">
            {conflictsWithSuggestions.map((conflict, idx) => (
              <div
                key={idx}
                className="bg-yellow-100 border border-yellow-400 p-4 rounded-lg shadow"
              >
                <h2 className="text-lg font-semibold mb-2">{conflict.type}</h2>
                <p className="text-sm mb-3">{conflict.message}</p>
                <ul className="list-disc ml-6 space-y-2 text-sm">
                  {conflict.entries.map((entry, i) => (
                    <li key={i}>
                      <strong>{entry.moduleName}</strong> | {entry.lectureName} | Room:{" "}
                      {entry.room} →{" "}
                      <span className="font-medium text-blue-600">{entry.suggestedRoom}</span>{" "}
                      | Time: {entry.timeSlot} →{" "}
                      <span className="font-medium text-blue-600">{entry.suggestedTime}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal with animation */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Confirm Fix Conflicts
              </h2>
              <p className="mb-6 text-gray-700">
                Are you sure you want to apply the suggested changes to resolve all conflicts?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={handleFixConflicts}
                >
                  Yes, Fix Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConflictList;
