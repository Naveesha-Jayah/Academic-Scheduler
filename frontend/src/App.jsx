import React from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./Others/NavBar";
import Footer from "./Others/Footer";
import Course from "./Components/Course & Lecturer Management/CourseManagement"
import Lecture from "./Components/Course & Lecturer Management/LectureManagement"
import TimeTableManagement from "./Components/Course & Lecturer Management/TimeTableManagement "


const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 p-6 md:p-10 bg-base-100">
        <Routes>
          <Route path = "/Course" element={<Course/>} />
          <Route path = "/Lecture" element={<Lecture/>} />
          <Route path ="/TimeTable" element={<TimeTableManagement/>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
