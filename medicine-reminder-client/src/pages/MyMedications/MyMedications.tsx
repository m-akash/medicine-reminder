import React from "react";
import { FaPills, FaEdit, FaBell, FaTrash } from "react-icons/fa";
import { GiPill, GiMedicines, GiVial } from "react-icons/gi";
import { Link } from "react-router-dom";

const medications = [
  {
    name: "Lisinopril",
    icon: (
      <FaPills
        className="text-blue-400 bg-blue-100 rounded-full p-2"
        size={40}
      />
    ),
    dosage: "10mg",
    frequency: "Once daily",
    time: "8:00 AM",
    remaining: 3,
  },
  {
    name: "Metformin",
    icon: (
      <GiPill
        className="text-green-400 bg-green-100 rounded-full p-2"
        size={40}
      />
    ),
    dosage: "500mg",
    frequency: "Twice daily",
    time: "2:00 PM, 8:00 PM",
    remaining: 7,
  },
  {
    name: "Atorvastatin",
    icon: (
      <GiMedicines
        className="text-purple-400 bg-purple-100 rounded-full p-2"
        size={40}
      />
    ),
    dosage: "20mg",
    frequency: "Once daily",
    time: "8:00 PM",
    remaining: 20,
  },
  {
    name: "Vitamin D",
    icon: (
      <GiVial
        className="text-yellow-400 bg-yellow-100 rounded-full p-2"
        size={40}
      />
    ),
    dosage: "1000 IU",
    frequency: "Once daily",
    time: "8:00 AM",
    remaining: 45,
  },
];

const getRemainingColor = (days: number) => {
  if (days <= 3) return "text-red-500";
  if (days <= 7) return "text-yellow-500";
  return "text-green-500";
};

const MyMedications = () => {
  return (
    <div className="w-full">
      <div className="bg-white text-black rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold break-words text-purple-600">
            My Medications
          </h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-base sm:text-lg shadow w-full sm:w-auto justify-center">
            <Link to="/add-medicine">
              <span className="text-2xl">+</span> Add Medication
            </Link>
          </button>
        </div>
        <div className="hidden md:block w-full overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="py-4 px-3 md:px-6 font-semibold">Medication</th>
                <th className="py-4 px-3 md:px-6 font-semibold">Dosage</th>
                <th className="py-4 px-3 md:px-6 font-semibold">Frequency</th>
                <th className="py-4 px-3 md:px-6 font-semibold">Time</th>
                <th className="py-4 px-3 md:px-6 font-semibold">Remaining</th>
                <th className="py-4 px-3 md:px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((med) => (
                <tr
                  key={med.name}
                  className="border-b last:border-b-0 hover:bg-gray-50 transition"
                >
                  <td className="py-4 px-3 md:px-6 flex items-center gap-4">
                    {med.icon}
                    <span className="font-semibold text-lg">{med.name}</span>
                  </td>
                  <td className="py-4 px-3 md:px-6 font-medium">
                    {med.dosage}
                  </td>
                  <td className="py-4 px-3 md:px-6 font-medium">
                    {med.frequency}
                  </td>
                  <td className="py-4 px-3 md:px-6 font-medium">{med.time}</td>
                  <td
                    className={`py-4 px-3 md:px-6 font-bold ${getRemainingColor(
                      med.remaining
                    )}`}
                  >
                    {med.remaining} days
                  </td>
                  <td className="py-4 px-3 md:px-6 flex gap-4 text-xl">
                    <button className="hover:text-indigo-600" title="Edit">
                      <Link to="/update-medicine">
                        <FaEdit />
                      </Link>
                    </button>
                    <button className="hover:text-yellow-500" title="Remind">
                      <FaBell />
                    </button>
                    <button className="hover:text-red-500" title="Delete">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-4 md:hidden w-full">
          {medications.map((med) => (
            <div
              key={med.name}
              className="rounded-xl border border-gray-200 shadow p-4 flex flex-col gap-2 bg-white w-full relative"
            >
              <div className="absolute top-4 right-4 flex gap-2 text-xl">
                <button className="hover:text-indigo-600" title="Edit">
                  <Link to="/update-medicine">
                    <FaEdit />
                  </Link>
                </button>
                <button className="hover:text-yellow-500" title="Remind">
                  <FaBell />
                </button>
                <button className="hover:text-red-500" title="Delete">
                  <FaTrash />
                </button>
              </div>
              <div className="flex items-center gap-4 mb-2 pr-20">
                {" "}
                {med.icon}
                <div>
                  <div className="font-semibold text-lg">{med.name}</div>
                  <div className="text-sm text-gray-500">
                    {med.dosage} • {med.frequency}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-700">
                  Time: {med.time}
                </div>
                <div
                  className={`font-bold text-sm ${getRemainingColor(
                    med.remaining
                  )}`}
                >
                  {med.remaining} days
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyMedications;
