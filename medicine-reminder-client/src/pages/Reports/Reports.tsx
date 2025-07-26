import React from "react";
import Report from "../../components/Report.tsx";
import BaseHelmet from "../../components/BaseHelmet.tsx";

const Reports = () => {
  return (
    <>
      <BaseHelmet 
        title="Medication Reports - Medicine Reminder"
        description="View detailed medication reports, track your adherence, and analyze your health patterns with comprehensive analytics and insights."
      />
      <div className="min-h-screen p-4 sm:p-8 md:p-20 bg-gray-50 text-black">
        <Report></Report>
      </div>
    </>
  );
};

export default Reports;
