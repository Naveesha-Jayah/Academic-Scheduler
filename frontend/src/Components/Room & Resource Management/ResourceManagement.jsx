import { useState, useEffect } from "react";

export default function ResourceCRUD() {
    const [formData, setFormData] = useState({
        roomName: "",
        type: "",
        projectors: "",
        computers: "",
        whiteboards: "",
        presentationSoftware: ""
    });

    const [resources, setResources] = useState([]);

    useEffect(() => {
        fetch("/api/resources")
            .then(response => response.json())
            .then(data => setResources(data))
            .catch(error => console.error("Error fetching resources:", error));
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/resources", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                const newResource = await response.json();
                setResources([...resources, newResource]);
                setFormData({
                    roomName: "",
                    type: "",
                    projectors: "",
                    computers: "",
                    whiteboards: "",
                    presentationSoftware: ""
                });
            }
        } catch (error) {
            console.error("Error adding resource:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/resources/${id}`, {
                method: "DELETE"
            });
            if (response.ok) {
                setResources(resources.filter(resource => resource._id !== id));
            }
        } catch (error) {
            console.error("Error deleting resource:", error);
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">Manage Resources</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {Object.keys(formData).map((key) => (
                    <div key={key}>
                        <label className="block font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                        <input 
                            type="text" 
                            name={key} 
                            value={formData[key]} 
                            onChange={handleChange} 
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                ))}
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Add Resource
                </button>
            </form>
            <h2 className="text-xl font-bold mt-6">Resources</h2>
            <ul className="mt-4">
                {resources.map(resource => (
                    <li key={resource._id} className="border p-2 mt-2 flex justify-between">
                        <span>{resource.roomName} - {resource.type}</span>
                        <button 
                            onClick={() => handleDelete(resource._id)} 
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
