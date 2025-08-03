import React from "react";
import MyMedications from "../MyMedications/MyMedications.tsx";
import BaseHelmet from "../../components/BaseHelmet.tsx";

const Medications = () => {
  return (
    <>
      <BaseHelmet
        title="My Medications - Medicine Reminder"
        description="View and manage all your medications in one place. Track dosages, schedules, and medication history with our comprehensive medication management system."
      />
      <div className="min-h-screen bg-gradient-to-r from-emerald-50 via-indigo-100 to-amber-100 shadow-lg py-8 px-5">
        <MyMedications />
      </div>
    </>
  );
};

export default Medications;
