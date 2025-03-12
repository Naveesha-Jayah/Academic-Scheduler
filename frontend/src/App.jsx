import React from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./Others/NavBar";
import Footer from "./Others/Footer";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 p-6 md:p-10 bg-base-100">
        <Routes>
          {/* Your routes here */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
