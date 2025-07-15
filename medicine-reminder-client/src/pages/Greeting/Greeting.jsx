import React from "react";

const Greeting = () => {
  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="flex-shrink-0 bg-blue-400 rounded-full w-14 h-14 flex items-center justify-center shadow-md">
          <span className="text-white text-2xl font-bold">S</span>
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Good Morning, <span className="text-blue-600">Sarah</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Here's your medications overview today!
          </p>
        </div>
      </div>
      <div className="text-right w-full md:w-auto">
        <p className="text-gray-700 text-base md:text-lg font-medium">
          Monday, July 15
        </p>
      </div>
    </div>
  );
};

export default Greeting;
