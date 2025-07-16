import React from "react";
import type { JSX } from "react";
import { useState } from "react";
import { FaPlus, FaPills, FaCheckCircle, FaClock } from "react-icons/fa";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Sample schedule data
const sampleSchedule = [
  {
    day: 0, // Sunday
    meds: [
      { name: "Lisinopril", time: "8:00 AM", status: "taken" },
      { name: "Metformin", time: "2:00 PM", status: "upcoming" },
    ],
  },
  {
    day: 1, // Monday
    meds: [{ name: "Atorvastatin", time: "8:00 PM", status: "upcoming" }],
  },
  {
    day: 2, // Tuesday
    meds: [{ name: "Vitamin D", time: "8:00 AM", status: "missed" }],
  },
  {
    day: 3, // Wednesday
    meds: [],
  },
  {
    day: 4, // Thursday
    meds: [{ name: "Metformin", time: "2:00 PM", status: "upcoming" }],
  },
  {
    day: 5, // Friday
    meds: [
      { name: "Lisinopril", time: "8:00 AM", status: "taken" },
      { name: "Atorvastatin", time: "8:00 PM", status: "upcoming" },
    ],
  },
  {
    day: 6, // Saturday
    meds: [],
  },
];

const statusStyles: { [key: string]: string } = {
  taken: "text-green-600 bg-green-100",
  upcoming: "text-blue-600 bg-blue-100",
  missed: "text-red-600 bg-red-100",
};

const statusIcon: { [key: string]: JSX.Element } = {
  taken: <FaCheckCircle className="text-green-500" />,
  upcoming: <FaClock className="text-blue-500" />,
  missed: <FaClock className="text-red-500" />,
};

const Schedule = () => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

  const today = new Date().getDay();

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-2 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-6 md:p-10 flex flex-col gap-6">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-2 text-center">
          Medication Schedule
        </h1>
        {/* Weekday Selector */}
        <div className="flex justify-between gap-2 mb-6">
          {weekDays.map((day, idx) => (
            <button
              key={day}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-200 text-sm md:text-base
                ${
                  selectedDay === idx
                    ? "bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow"
                    : today === idx
                    ? "border-2 border-indigo-400 text-indigo-700 bg-indigo-50"
                    : "bg-gray-100 text-gray-600 hover:bg-indigo-50"
                }
              `}
              onClick={() => setSelectedDay(idx)}
            >
              {day}
            </button>
          ))}
        </div>
        {/* Medications for Selected Day */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            {weekDays[selectedDay]}'s Medications
          </h2>
          {sampleSchedule[selectedDay].meds.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              <FaPills className="mx-auto text-4xl mb-2" />
              No medications scheduled for this day.
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {sampleSchedule[selectedDay].meds.map((med, i) => (
                <li
                  key={i}
                  className={`flex items-center gap-4 p-4 rounded-xl shadow-sm border ${
                    statusStyles[med.status]
                  }`}
                >
                  <span className="text-2xl">{statusIcon[med.status]}</span>
                  <div className="flex-1">
                    <div className="font-bold text-lg">{med.name}</div>
                    <div className="text-gray-600 text-sm">{med.time}</div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusStyles[med.status]
                    }`}
                  >
                    {med.status.charAt(0).toUpperCase() + med.status.slice(1)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Floating Action Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl transition-all duration-200"
        aria-label="Add Schedule"
        onClick={() => alert("Add Schedule (not implemented)")}
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default Schedule;
