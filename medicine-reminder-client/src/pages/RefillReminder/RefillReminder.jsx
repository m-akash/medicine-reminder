import React from "react";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaPills,
  FaExclamationTriangle,
} from "react-icons/fa";

const sampleMedications = [
  {
    id: 1,
    name: "Atorvastatin",
    pillsLeft: 5,
    daysLeft: 2,
  },
  {
    id: 2,
    name: "Metformin",
    pillsLeft: 10,
    daysLeft: 5,
  },
  {
    id: 3,
    name: "Lisinopril",
    pillsLeft: 2,
    daysLeft: 1,
  },
];

const pharmacies = [
  {
    id: 1,
    name: "City Pharmacy",
    address: "123 Main St, Springfield",
    phone: "(555) 123-4567",
  },
  {
    id: 2,
    name: "HealthPlus Pharmacy",
    address: "456 Oak Ave, Springfield",
    phone: "(555) 987-6543",
  },
];

const RefillReminder = () => {
  return (
    <div className="flex flex-col md:flex-row md:gap-60 gap-10 max-w-5xl mx-auto py-10 px-2">
      {/* Left: Refill Reminders */}
      <div className="md:w-2/3 w-full bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
          <FaExclamationTriangle className="text-amber-400" /> Refill Reminders
        </h2>
        <div className="flex flex-col gap-4">
          {sampleMedications.map((med) => (
            <div
              key={med.id}
              className={`rounded-xl border-2 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow transition-all ${
                med.pillsLeft <= 5 || med.daysLeft <= 2
                  ? "border-amber-400 bg-amber-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <FaPills
                  className={`text-3xl ${
                    med.pillsLeft <= 5 || med.daysLeft <= 2
                      ? "text-amber-500"
                      : "text-blue-400"
                  }`}
                />
                <div>
                  <div className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    {med.name}
                    {(med.pillsLeft <= 5 || med.daysLeft <= 2) && (
                      <span className="ml-2 text-xs bg-amber-400 text-white px-2 py-0.5 rounded-full font-semibold animate-pulse">
                        Urgent
                      </span>
                    )}
                  </div>
                  <div className="text-gray-700 text-sm mt-1">
                    Pills left:{" "}
                    <span
                      className={
                        med.pillsLeft <= 5
                          ? "text-red-500 font-bold"
                          : "font-semibold"
                      }
                    >
                      {med.pillsLeft}
                    </span>
                  </div>
                  <div className="text-gray-700 text-sm">
                    Days left:{" "}
                    <span
                      className={
                        med.daysLeft <= 2
                          ? "text-red-500 font-bold"
                          : "font-semibold"
                      }
                    >
                      {med.daysLeft}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow">
                  <FaPills /> Refill
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow">
                  Snooze
                </button>
              </div>
            </div>
          ))}
          {sampleMedications.length === 0 && (
            <div className="text-center text-gray-500">
              No refills needed at this time.
            </div>
          )}
        </div>
      </div>

      {/* Right: Pharmacy Contacts */}
      <div className="md:w-1/3 w-full bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2 mb-2">
          <FaMapMarkerAlt className="text-amber-500" /> Pharmacy Contacts
        </h2>
        <div className="flex flex-col gap-4">
          {pharmacies.map((pharm) => (
            <div
              key={pharm.id}
              className="border border-gray-200 rounded-xl p-4 flex flex-col gap-2 bg-blue-50"
            >
              <div className="font-semibold text-lg text-blue-900 flex items-center gap-2">
                <FaPills className="text-blue-400" /> {pharm.name}
              </div>
              <div className="text-gray-700 text-sm flex items-center gap-2">
                <FaMapMarkerAlt className="text-amber-500" /> {pharm.address}
              </div>
              <div className="text-gray-700 text-sm flex items-center gap-2">
                <FaPhoneAlt className="text-green-500" /> {pharm.phone}
              </div>
              <div className="flex gap-2 mt-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
                  <FaPhoneAlt /> Call
                </button>
                <button className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
                  <FaMapMarkerAlt /> Directions
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RefillReminder;
