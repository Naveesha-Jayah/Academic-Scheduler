import React from 'react';

const HomePage = () => {
  return (
    <div
      className="min-h-screen min-w-full flex flex-col items-center justify-center p-6"
      style={{
        background: 'linear-gradient(-45deg, #0a192f, #1a1a2e, #4a154b, #000000)', // Gradient colors
        backgroundSize: '400% 400%', // Size of the gradient
        animation: 'gradient 15s ease infinite', // Gradient animation
      }}
    >
      {/* Content Section */}
      <div className="text-center text-white">
        {/* Welcome Message */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Academic Scheduler</h1>
        <p className="text-lg md:text-xl mb-8 text-gray-200">
          Manage academic schedules and view timetables with ease.
        </p>

        {/* Buttons for Admin and Student Login */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          {/* Admin Login Button */}
          <button
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors"
            onClick={() => {
              console.log('Redirecting to admin login...');
              // Example: window.location.href = '/admin-login';
            }}
          >
            Admin Login
          </button>

          {/* Student Login Button */}
          <button
            className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-700 transition-colors"
            onClick={() => {
              console.log('Redirecting to student login...');
              // Example: window.location.href = '/student-login';
            }}
          >
            Student Login
          </button>
        </div>
      </div>

      {/* Add the CSS animation keyframes */}
      <style>
        {`
          /* Gradient Animation */
          @keyframes gradient {
            0% {
              background-position: 0% 50%; // Start position of the gradient
            }
            50% {
              background-position: 100% 50%; // Middle position of the gradient
            }
            100% {
              background-position: 0% 50%; // End position of the gradient
            }
          }
        `}
      </style>
    </div>
  );
};

export default HomePage;