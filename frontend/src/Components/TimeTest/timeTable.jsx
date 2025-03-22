import React from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { saveAs } from "file-saver";

const Timetable = ({ timetableData }) => {
  // Group timetable data by day
  const groupedByDay = timetableData.reduce((acc, entry) => {
    if (!acc[entry.day]) {
      acc[entry.day] = [];
    }
    acc[entry.day].push(entry);
    return acc;
  }, {});

  // Define the order of days
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Function to generate and download the PDF
  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = height - 50;
    page.drawText("Timetable Report", {
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
    days.forEach((day) => {
      if (groupedByDay[day]) {
        groupedByDay[day].forEach((entry) => {
          const text = `${day} | ${entry.moduleName} | ${entry.lectureName} | ${entry.room} | ${entry.timeSlot}`;
          page.drawText(text, {
            x: 50,
            y,
            size: 12,
            font,
            color: rgb(0, 0, 0),
          });
          y -= 15;
        });
      } else {
        const text = `${day} | No classes scheduled`;
        page.drawText(text, {
          x: 50,
          y,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });
        y -= 15;
      }
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, "Timetable_Report.pdf");
  };

  return (
    <div className="overflow-x-auto">
      <button
        onClick={generatePDF}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-200"
      >
        Download Timetable as PDF
      </button>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-blue-100">
            <th className="px-4 py-2 border">Day</th>
            <th className="px-4 py-2 border">Module</th>
            <th className="px-4 py-2 border">Lecture</th>
            <th className="px-4 py-2 border">Room</th>
            <th className="px-4 py-2 border">Time Slot</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <React.Fragment key={day}>
              <tr className="bg-gray-50">
                <td colSpan="5" className="px-4 py-2 font-bold border">
                  {day}
                </td>
              </tr>
              {groupedByDay[day] ? (
                groupedByDay[day].map((entry) => (
                  <tr key={entry._id} className="text-center">
                    <td className="px-4 py-2 border"></td>
                    <td className="px-4 py-2 border">{entry.moduleName}</td>
                    <td className="px-4 py-2 border">{entry.lectureName}</td>
                    <td className="px-4 py-2 border">{entry.room}</td>
                    <td className="px-4 py-2 border">{entry.timeSlot}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-2 text-center border">
                    No classes scheduled
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;