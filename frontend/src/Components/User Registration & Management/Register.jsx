import React, { useState } from "react";
import axiosInstance from "../../Lib/axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending Data:", form);  // Debug log
    try {
      const response = await axiosInstance.post("/api/auth/register", form);
      console.log("Response:", response.data);  // Log response from backend
      navigate("/login");
    } catch (error) {
      console.error("Error registering user", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Register</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="name"
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
            
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;