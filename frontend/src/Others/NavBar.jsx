import React, { useState } from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <div className="navbar bg-base-200 shadow-md px-4">
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-square btn-ghost"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-6 w-6 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>

        {/* Navbar Title */}
        <div className="flex-1 px-4">
          <a className="btn btn-ghost text-xl font-bold">EduScheduler</a>
        </div>

        {/* Profile Button */}
        <button className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-6 w-6 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 2 0zm7 0a1 1 0 11-2 0 1 1 0 2 0zm7 0a1 1 0 11-2 0 1 1 0 2 0z"
            ></path>
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-50 transition-all ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex`}
      >
        {/* Sidebar Panel */}
        <div className="w-64 bg-base-300 h-full p-5 shadow-lg flex flex-col">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Dashboard</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-circle btn-sm"
            >
              ✕
            </button>
          </div>

          {/* Sidebar Items */}
          <ul className="mt-5 space-y-2">
            <li>
              <Link
                to="/"
                className="flex items-center p-3 rounded-lg hover:bg-base-200 transition"
              >
                🏠 Home
              </Link>
            </li>
            <li>
              <Link
                to="/Course"
                className="flex items-center p-3 rounded-lg hover:bg-base-200 transition"
              >
                📚 Courses & Lecturers
              </Link>
            </li>
            <li>
              <Link
                to="/TimeTable"
                className="flex items-center p-3 rounded-lg hover:bg-base-200 transition"
              >
                📅 Timetable Schedule
              </Link>
            </li>
            <li>
              <Link
                to="/Room"
                className="flex items-center p-3 rounded-lg hover:bg-base-200 transition"
              >
                🚪 Rooms
              </Link>
            </li>
            <li>
              <Link
                to="/Resource"
                className="flex items-center p-3 rounded-lg hover:bg-base-200 transition"
              >
                💻 Resources
              </Link>
            </li>
            <li></li>
            <li>
              <Link
                to="/schedule"
                className="flex items-center p-3 rounded-lg hover:bg-base-200 transition"
              >
                👨‍💻 AI Resolution
              </Link>
            </li>
          </ul>
        </div>

        {/* Overlay (Click to Close) */}
        <div
          className="flex-1 backdrop:brightness-200 bg-opacity-40" // Changed to a more transparent overlay
          onClick={() => setIsOpen(false)}
        ></div>
      </div>
    </>
  );
};

export default NavBar;
