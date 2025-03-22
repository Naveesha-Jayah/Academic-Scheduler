import React from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./Others/NavBar";
import Footer from "./Others/Footer";
import Course from "./Components/Course & Lecturer Management/CourseManagement"
import Lecture from "./Components/Course & Lecturer Management/LectureManagement"
import TimeTable from "./Components/Timetable Scheduling/TimeTableManagement ";
import Room from "./Components/Room & Resource Management/RoomManagement"
import Resource from "./Components/Room & Resource Management/ResourceManagement";
import Register from "./Components/User Registration & Management/register";
import Login from "./Components/User Registration & Management/Login";
import Conflicts from "./Components/AI-Powered Conflict Resolution/Conflicts";
import ConflictList from "./Components/AI-Powered Conflict Resolution/ConflictList";
import ResolveConflicts from "./Components/AI-Powered Conflict Resolution/ResolveConflicts";
import Profile from "./Components/User Registration & Management/Profile";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 p-6 md:p-10 bg-base-100">
        <Routes>
          <Route path = "/Course" element={<Course/>} />
          <Route path = "/Lecture" element={<Lecture/>} />
          <Route path ="/TimeTable" element={<TimeTable/>} />
          <Route path ="/Room" element={<Room/>} />
          <Route path ="/Resource" element={<Resource/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/Conflicts" element={<Conflicts/>} />
          <Route path="/ConflictList" element={<ConflictList/>} />
          <Route path="/ResolveConflicts" element={<ResolveConflicts/>} />
          <Route path="/profile" element={<Profile/>}/>
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
