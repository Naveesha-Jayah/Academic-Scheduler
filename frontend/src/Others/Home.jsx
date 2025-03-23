import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Redirect to the login page
    navigate('/login'); // Replace '/login' with the actual path of your login page
  };

  return (
    <div
      className="min-h-screen min-w-full flex flex-col items-center justify-center p-6"
      style={{
        background: 'linear-gradient(-45deg, #0a192f, #1a1a2e, #4a154b, #000000)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
      }}
    >
      <div className="text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Academic Scheduler</h1>
        <p className="text-lg md:text-xl mb-8 text-gray-200">
          Manage academic schedules and view timetables with ease.
        </p>

        {/* Login Button */}
        <button
          className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-purple-700 transition-colors"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>

      {/* Gradient Animation Keyframes */}
      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
};

export default HomePage;