import React, { useState } from "react";
import axiosInstance from "../../Lib/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending login data:", form); // Debug log
    try {
      const response = await axiosInstance.post("/api/auth/login", form);

      // ✅ Store User Data in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    
      console.log("Login Success:", response.data); // Log response
      navigate("/profile");
    } catch (error) {
      console.error("Error logging in", error);
    }
  };

  return (
    <div className="container p-4 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
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
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;