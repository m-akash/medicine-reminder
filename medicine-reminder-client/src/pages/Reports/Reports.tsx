import React from "react";

const Reports = () => {
  return (
    <div className="min-h-screen p-4 sm:p-8 md:p-20 bg-gray-50 text-black">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 text-center mb-2">
          Reports
        </h1>
        <p className="text-gray-600 text-center mb-8 text-base sm:text-lg">
          View your medication adherence, missed doses, and upcoming refills.
          Export your data for your records or to share with your doctor.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8">
          <div className="flex-1 bg-gray-100 rounded-xl p-4 shadow text-center">
            <h2 className="text-lg font-semibold mb-1">Adherence Rate</h2>
            <p className="text-2xl font-bold text-blue-700 mb-0.5">92%</p>
            <span className="text-gray-500 text-sm">This Month</span>
          </div>
          <div className="flex-1 bg-gray-100 rounded-xl p-4 shadow text-center">
            <h2 className="text-lg font-semibold mb-1">Missed Doses</h2>
            <p className="text-2xl font-bold text-blue-700 mb-0.5">3</p>
            <span className="text-gray-500 text-sm">This Month</span>
          </div>
          <div className="flex-1 bg-gray-100 rounded-xl p-4 shadow text-center">
            <h2 className="text-lg font-semibold mb-1">Upcoming Refills</h2>
            <p className="text-2xl font-bold text-blue-700 mb-0.5">2</p>
            <span className="text-gray-500 text-sm">Next 7 Days</span>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Adherence Over Time</h2>
          <div className="h-36 sm:h-56 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-base">
            [Chart Placeholder]
          </div>
        </div>
        {/* Uncomment below if you want export buttons */}
        {/*
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-6 items-center justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 py-2 font-medium transition">Download PDF</button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 py-2 font-medium transition">Download CSV</button>
        </div>
        */}
      </div>
    </div>
  );
};

export default Reports;
