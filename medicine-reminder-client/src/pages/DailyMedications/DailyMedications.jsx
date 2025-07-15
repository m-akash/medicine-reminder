import React from "react";

const medications = [
  {
    period: "Morning",
    time: "8:00 AM",
    icon: (
      <span className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
        {/* Gear/star icon placeholder */}
        <svg
          width="28"
          height="28"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="text-blue-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V3m0 0a9 9 0 110 18m0-18v3m0 0a9 9 0 100 18m0-18v3"
          />
        </svg>
      </span>
    ),
    bg: "bg-blue-50",
    badge: { text: "Completed", color: "bg-green-100 text-green-700" },
    meds: [
      { name: "Lisinopril (10mg)", taken: true },
      { name: "Vitamin D (1000 IU)", taken: true },
    ],
  },
  {
    period: "Afternoon",
    time: "2:00 PM",
    icon: (
      <span className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full">
        {/* Sun icon placeholder */}
        <svg
          width="28"
          height="28"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="text-yellow-500"
        >
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
          <path
            stroke="currentColor"
            strokeWidth="2"
            d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41"
          />
        </svg>
      </span>
    ),
    bg: "bg-yellow-50",
    badge: { text: "Upcoming", color: "bg-yellow-100 text-yellow-700" },
    meds: [{ name: "Metformin (500mg)", taken: false }],
  },
  {
    period: "Evening",
    time: "8:00 PM",
    icon: (
      <span className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full">
        {/* Moon icon placeholder */}
        <svg
          width="28"
          height="28"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="text-indigo-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
          />
        </svg>
      </span>
    ),
    bg: "bg-indigo-50",
    badge: { text: "Upcoming", color: "bg-indigo-100 text-indigo-700" },
    meds: [
      { name: "Atorvastatin (20mg)", taken: false },
      { name: "Metformin (500mg)", taken: false },
    ],
  },
];

const DailyMedications = () => {
  return (
    <div className=" flex flex-col items-center justify-center p-2 relative">
      <div className="bg-white rounded-2xl shadow-md p-2 sm:p-4 md:p-8 w-full max-w-md md:max-w-7xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-blue-700 text-center">
          Today's Medications
        </h1>
        <div className="flex flex-col md:flex-row md:gap-6 gap-4 w-full">
          {medications.map((slot) => (
            <div
              key={slot.period}
              className={`w-full md:flex-1 rounded-xl p-4 md:p-6 ${slot.bg} text-black flex flex-col relative mb-4 md:mb-0`}
            >
              {/* Badge */}
              <span
                className={`absolute top-3 right-3 px-3 py-1 rounded-lg text-xs md:text-sm font-semibold ${slot.badge.color}`}
              >
                {slot.badge.text}
              </span>
              <div className="flex items-center gap-3 md:gap-4 mb-4">
                {/* Icon size responsive */}
                <span className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full">
                  {slot.icon}
                </span>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold">
                    {slot.period}
                  </h2>
                  <p className="text-gray-500 font-medium text-sm md:text-base">
                    {slot.time}
                  </p>
                </div>
              </div>
              <div className="mt-2 space-y-3 md:space-y-4">
                {slot.meds.map((med) => (
                  <div
                    key={med.name}
                    className="flex items-center gap-2 md:gap-3"
                  >
                    {med.taken ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-green-500">
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="text-green-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-gray-300">
                        <svg
                          width="14"
                          height="14"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="text-gray-400"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="6"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      </span>
                    )}
                    <span className="text-base md:text-lg font-medium text-gray-800">
                      {med.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Floating Action Button for mobile only */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl md:hidden transition-all duration-200"
        aria-label="Add Medication"
        onClick={() => alert("Add Medication (not implemented)")}
      >
        +
      </button>
    </div>
  );
};

export default DailyMedications;
