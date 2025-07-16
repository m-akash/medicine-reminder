import React from "react";
import Greeting from "../Greeting/Greeting.tsx";
import DailyMedications from "../DailyMedications/DailyMedications.tsx";
import MyMedications from "../MyMedications/MyMedications.tsx";
import RefillReminder from "../RefillReminder/RefillReminder.tsx";

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
