import { useState, useEffect } from "react";
import axiosInstance from "../../Lib/axios"; // ✅ Import axiosInstance

const ConflictList = () => {
    const [conflicts, setConflicts] = useState([]);

    // Fetch conflicts on component mount
    useEffect(() => {
        const fetchConflicts = async () => {
            try {
                const response = await axiosInstance.get("/api/detect-conflicts"); // ✅ Use axiosInstance
                setConflicts(response.data.conflicts);
            } catch (error) {
                console.error("Error fetching conflicts", error);
            }
        };

        fetchConflicts();
    }, []);

    // Resolve conflicts when button is clicked
    const resolveConflicts = async () => {
        try {
            await axiosInstance.post("/api/resolve-conflicts"); // ✅ Use axiosInstance
            window.location.reload(); // Refresh page after resolving
        } catch (error) {
            console.error("Error resolving conflicts", error);
        }
    };

    return (
        <div>
            <h2>Conflicts Detected</h2>
            {conflicts.length > 0 ? (
                <ul>
                    {conflicts.map((c, index) => (
                        <li key={index}>
                            Conflict between Schedule {c.schedule1} and {c.schedule2} ({c.conflictType})
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No conflicts found.</p>
            )}
            {conflicts.length > 0 && <button onClick={resolveConflicts}>Resolve Conflicts</button>}
        </div>
    );
};

export default ConflictList;
