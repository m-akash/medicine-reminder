import React from "react";
import Greeting from "../Greeting/Greeting";
import DailyMedications from "../DailyMedications/DailyMedications";
import MyMedications from "../MyMedications/MyMedications";
import RefillReminder from "../RefillReminder/RefillReminder";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-2">
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-3xl shadow-xl flex flex-col gap-6">
          <Greeting />
          <DailyMedications />
          <MyMedications />
          <RefillReminder />
        </div>
      </div>
    </div>
  );
};

export default Home;
