import React from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./Others/NavBar";
import Footer from "./Others/Footer";
import HomePage from "./Others/Home";
import Course from "./Components/Course & Lecturer Management/CourseManagement"
import Lecture from "./Components/Course & Lecturer Management/LectureManagement"
import TimeTable from "./Components/Timetable Scheduling/TimeTableManagement ";
import Resource from "./Components/Room & Resource Management/ResourceManagement";
import Register from "./Components/User Registration & Management/register";
import Login from "./Components/User Registration & Management/Login";
import Conflicts from "./Components/AI-Powered Conflict Resolution/Conflicts";
import ConflictList from "./Components/AI-Powered Conflict Resolution/ConflictList";
import ResolveConflicts from "./Components/AI-Powered Conflict Resolution/ResolveConflicts";
import Profile from "./Components/User Registration & Management/Profile";
import Room from "./Components/Room & Resource Management/RoomManagement";
import TimeTableSchedule from "./Components/Timetable Scheduling/TimeTableSchedule"
import TimeTest from "./Components/TimeTest/timeTest";
import Timetable from "./Components/TimeTest/timeTable";
import StudentProfile from  "./Components/Dashboads/StudentProfile"


const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 p-6 md:p-10 bg-base-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
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
          <Route path ="/TimeTableSchedule" element={<TimeTableSchedule/>} />
          <Route path ="/TimeTest" element={<TimeTest/>} />
          <Route path ="/Timetable" element={<Timetable/>} />
          <Route path ="/StudentProfile" element={<StudentProfile/>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
