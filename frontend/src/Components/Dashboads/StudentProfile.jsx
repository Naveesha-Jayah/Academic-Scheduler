import React, { useEffect, useState } from "react";
import axiosInstance from "../../Lib/axios";
import { saveAs } from "file-saver"; // For report generation
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"; // For PDF report generation

const StudentDashboard = () => {
  // Sample data for the student
  const student = {
    name: 'John Doe',
    studentId: 'S123456',
    email: 'john.doe@university.edu',
    department: 'Computer Science',
    semester: 'Fall 2023',
  };

  // State to store TimeTest timetables
  const [timeTestTimetables, setTimeTestTimetables] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [filteredTimetables, setFilteredTimetables] = useState([]);

  // Fetch TimeTest timetables on component mount
  useEffect(() => {
    fetchTimeTestTimetables();
  }, []);

  // Fetch TimeTest timetables from the API
  const fetchTimeTestTimetables = async () => {
    try {
      const response = await axiosInstance.get("/api/timeTable");
      setTimeTestTimetables(response.data);
    } catch (error) {
      console.error("Error fetching TimeTest timetables", error);
    }
  };

  // Filter timetables based on selected year and semester
  useEffect(() => {
    if (selectedYear && selectedSemester) {
      const filtered = timeTestTimetables.filter(
        tt => tt.year === parseInt(selectedYear) && tt.semester === parseInt(selectedSemester)
      );
      setFilteredTimetables(filtered);
    } else {
      setFilteredTimetables([]);
    }
  }, [selectedYear, selectedSemester, timeTestTimetables]);

  // Sort timetables by day (Monday to Friday)
  const sortTimetablesByDay = (timetables) => {
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    return timetables.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
  };

  // Generate a PDF report for the timetable
  const generatePDFReport = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = height - 50;
    page.drawText(`Timetable Report for Year ${selectedYear}, Semester ${selectedSemester}`, {
      x: 50,
      y,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    });

    y -= 30;
    page.drawText("Day | Module | Lecture | Room | Time Slot", {
      x: 50,
      y,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    y -= 20;
    sortTimetablesByDay(filteredTimetables).forEach(tt => {
      const text = `${tt.day} | ${tt.moduleName} | ${tt.lectureName} | ${tt.room} | ${tt.timeSlot}`;
      page.drawText(text, {
        x: 50,
        y,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      y -= 15;
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, `Timetable_Year${selectedYear}_Semester${selectedSemester}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-gray-200">Welcome back, {student.name}!</p>
      </header>

      {/* Student Profile Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Student Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600"><strong>Name:</strong> {student.name}</p>
            <p className="text-gray-600"><strong>Student ID:</strong> {student.studentId}</p>
            <p className="text-gray-600"><strong>Email:</strong> {student.email}</p>
          </div>
          <div>
            <p className="text-gray-600"><strong>Department:</strong> {student.department}</p>
            <p className="text-gray-600"><strong>Semester:</strong> {student.semester}</p>
          </div>
        </div>
      </div>

      {/* Year and Semester Selection */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Select Year and Semester</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg"
          >
            <option value="">Select Year</option>
            {[1, 2, 3, 4].map(year => <option key={year} value={year}>Year {year}</option>)}
          </select>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg"
          >
            <option value="">Select Semester</option>
            {[1, 2].map(sem => <option key={sem} value={sem}>Semester {sem}</option>)}
          </select>
        </div>
      </div>

      {/* TimeTest Timetable Section */}
      {selectedYear && selectedSemester && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">TimeTest Timetable</h2>
          <button
            onClick={generatePDFReport}
            className="mb-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-200"
          >
            Download Timetable (PDF)
          </button>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 text-left">Day</th>
                  <th className="py-2 px-4 text-left">Module</th>
                  <th className="py-2 px-4 text-left">Lecture</th>
                  <th className="py-2 px-4 text-left">Room</th>
                  <th className="py-2 px-4 text-left">Time Slot</th>
                </tr>
              </thead>
              <tbody>
                {sortTimetablesByDay(filteredTimetables).map((tt, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{tt.day}</td>
                    <td className="py-2 px-4">{tt.moduleName}</td>
                    <td className="py-2 px-4">{tt.lectureName}</td>
                    <td className="py-2 px-4">{tt.room}</td>
                    <td className="py-2 px-4">{tt.timeSlot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;