import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login"); // Redirect if not logged in
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        <div className="mt-4">
          {user ? (
            <>
              <p className="text-xl text-gray-700">
                <span className="font-semibold">Name:</span> {user.name}
              </p>
              <p className="text-xl text-gray-700 mt-2">
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  navigate("/login");
                }}
                className="mt-6 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <p className="text-gray-600">Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
