import { useEffect, useState } from "react";
import axiosInstance from "../../Lib/axios";

const Conflicts = () => {
    const [conflicts, setConflicts] = useState([]);

    useEffect(() => {
        const fetchConflicts = async () => {
            try {
                const response = await axiosInstance.get("/api/detect-conflicts");
                setConflicts(response.data);
            } catch (error) {
                console.error("Error fetching conflicts", error);
            }
        };

        fetchConflicts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
                    📌 Schedule Conflicts
                </h2>

                {conflicts.length === 0 ? (
                    <p className="text-gray-600 text-center">✅ No conflicts found!</p>
                ) : (
                    <div className="space-y-4">
                        {conflicts.map((conflict, index) => (
                            <div key={index} className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold text-red-700">
                                    ⚠️ Conflict Detected
                                </h3>
                                <p className="text-gray-700 mt-2">
                                    <span className="font-semibold text-gray-900">Course 1:</span> {conflict.schedule1.courseName} 
                                    <br />
                                    <span className="font-semibold text-gray-900">Course 2:</span> {conflict.schedule2.courseName}
                                </p>
                                <p className="text-gray-700 mt-2">
                                    <span className="font-semibold text-gray-900">Room:</span> {conflict.schedule1.room}
                                </p>
                                <p className="text-gray-600 text-sm mt-2">
                                    <span className="font-semibold">Status:</span> 
                                    <span className="ml-1 px-2 py-1 rounded-md text-white text-xs font-bold" 
                                        style={{ backgroundColor: conflict.resolved ? "green" : "red" }}>
                                        {conflict.resolved ? "Resolved" : "Unresolved"}
                                    </span>
                                </p>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex justify-center mt-6">
                    <button
                         type="submit"
                         className="bg-blue-400 text-white px-6 py-3 rounded-md hover:bg-blue-500 transition-colors shadow-md"
                    >
                    Conflicts List
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Conflicts;
