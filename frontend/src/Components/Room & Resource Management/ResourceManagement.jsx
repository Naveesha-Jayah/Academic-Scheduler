import React, { useEffect, useState } from "react";
import axiosInstance from "../../Lib/axios";
import jsPDF from "jspdf";

const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    roomName: "",
    type: "",
    Computers: "",
    projectors: "",
    whiteboards: "",
    presentationSystem: "",
  });
  const [editingResource, setEditingResource] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axiosInstance.get("/api/resources");
      setResources(response.data);
    } catch (error) {
      console.error("Error fetching resources", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingResource) {
        await axiosInstance.put(`/api/resources/${editingResource._id}`, form);
      } else {
        await axiosInstance.post("/api/resources", form);
      }
      setForm({ roomName: "", type: "", Computers: "", projectors: "", whiteboards: "", presentationSystem: "" });
      setEditingResource(null);
      fetchResources();
    } catch (error) {
      console.error("Error saving resource", error);
    }
  };

  const handleEdit = (resource) => {
    setForm(resource);
    setEditingResource(resource);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/resources/${id}`);
      fetchResources();
    } catch (error) {
      console.error("Error deleting resource", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Resource Management</h1>
      
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {editingResource ? "Edit Resource" : "Add New Resource"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input type="text" name="roomName" value={form.roomName} onChange={handleChange} placeholder="Room Name" required className="border p-2 rounded-md" />
          <input type="text" name="type" value={form.type} onChange={handleChange} placeholder="Type" required className="border p-2 rounded-md" />
          <input type="text" name="Computers" value={form.Computers} onChange={handleChange} placeholder="Computers" required className="border p-2 rounded-md" />
          <input type="text" name="projectors" value={form.projectors} onChange={handleChange} placeholder="Projectors" required className="border p-2 rounded-md" />
          <input type="text" name="whiteboards" value={form.whiteboards} onChange={handleChange} placeholder="Whiteboards" required className="border p-2 rounded-md" />
          <input type="text" name="presentationSystem" value={form.presentationSystem} onChange={handleChange} placeholder="Presentation System" required className="border p-2 rounded-md" />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">{editingResource ? "Update Resource" : "Add Resource"}</button>
        </form>
      </div>
      
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Resource List</h2>
        <input type="text" placeholder="Search resources..." value={search} onChange={(e) => setSearch(e.target.value)} className="border p-2 mb-4 w-full rounded-md" />
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Room Name</th>
              <th className="p-2">Type</th>
              <th className="p-2">Computers</th>
              <th className="p-2">Projectors</th>
              <th className="p-2">Whiteboards</th>
              <th className="p-2">Presentation System</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.filter((resource) => resource.roomName.toLowerCase().includes(search.toLowerCase())).map((resource) => (
              <tr key={resource._id} className="border-b">
                <td className="p-2">{resource.roomName}</td>
                <td className="p-2">{resource.type}</td>
                <td className="p-2">{resource.Computers}</td>
                <td className="p-2">{resource.projectors}</td>
                <td className="p-2">{resource.whiteboards}</td>
                <td className="p-2">{resource.presentationSystem}</td>
                <td className="p-2">
                  <button onClick={() => handleEdit(resource)} className="bg-yellow-500 text-white p-1 rounded-md mr-2">Edit</button>
                  <button onClick={() => handleDelete(resource._id)} className="bg-red-500 text-white p-1 rounded-md">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourceManagement;
