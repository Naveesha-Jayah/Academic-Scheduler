import { useEffect, useState } from "react";
import axiosInstance from "../../Lib/axios"; // ✅ Import axiosInstance

const ResolveConflicts = () => {
    const [resolutions, setResolutions] = useState([]);

    useEffect(() => {
        const fetchResolutions = async () => {
            try {
                const response = await axiosInstance.get("/api/resolve-conflicts"); // ✅ Use axiosInstance.get()
                setResolutions(response.data);
            } catch (error) {
                console.error("Error fetching conflict resolutions", error);
            }
        };

        fetchResolutions(); // Call function on component mount
    }, []);

    return (
        <div>
            <h2>AI-Powered Conflict Resolutions</h2>
            {resolutions.length === 0 ? <p>No conflicts to resolve!</p> : (
                <ul>
                    {resolutions.map((resolution, index) => (
                        <li key={index}>
                            {resolution.suggestedSolution}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ResolveConflicts;
