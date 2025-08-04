import React from "react";
import { FaPills, FaEdit, FaTrash } from "react-icons/fa";
import { GiPill, GiMedicines } from "react-icons/gi";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth.tsx";
import useMedicinesUser from "../../hooks/useMedicinesUser.tsx";
import { Medicine } from "../../types/index.ts";
import useAxiosSecure from "../../hooks/useAxiosSecure.tsx";
import {
  showConfirm,
  medicineNotifications,
} from "../../utils/notifications.ts";
import useUserSettings from "../../hooks/useUserSettings.tsx";

const getMedicineIcon = (days: number) => {
  if (days <= 3)
    return (
      <>
        <FaPills
          className="text-blue-400 bg-blue-100 rounded-full p-2"
          size={40}
        />
      </>
    );
  if (days <= 7)
    return (
      <>
        <GiPill
          className="text-green-400 bg-green-100 rounded-full p-2"
          size={40}
        />
      </>
    );
  return (
    <>
      <GiMedicines
        className="text-purple-400 bg-purple-100 rounded-full p-2"
        size={40}
      />
    </>
  );
};

const getRemainingColor = (days: number) => {
  if (days <= 3) return "text-red-500";
  if (days <= 7) return "text-yellow-500";
  return "text-green-500";
};

const getFreq = (frequency: string) => {
  if (frequency === "1-1-1") {
    return "Three times daily";
  }
  if (frequency === "1-0-1" || frequency === "0-1-1" || frequency === "1-1-0") {
    return "Twice daily";
  }
  if (frequency === "1-0-0" || frequency === "0-0-1" || frequency === "0-1-0") {
    return "Once daily";
  }
};

const formatTime = (time: string | Date) => {
  const date =
    typeof time === "string" ? new Date(`1970-01-01T${time}`) : new Date(time);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const getReminderTimes = (med: any, defaultReminderTimes: string[]) => {
  if (
    med.reminders &&
    med.reminders[0] &&
    med.reminders[0].times &&
    med.reminders[0].times.length > 0
  ) {
    return med.reminders[0].times
      .map((t: any) => formatTime(t.time))
      .join(", ");
  }

  const freqArr = med.frequency.split("-").map(Number);
  const times: string[] = [];
  for (let i = 0; i < freqArr.length; i++) {
    if (freqArr[i] === 1 && defaultReminderTimes[i]) {
      times.push(formatTime(defaultReminderTimes[i]));
    }
  }
  return times.join(", ");
};

const MyMedications = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const email = user?.email || "";
  const { data, refetch } = useMedicinesUser(email);
  const { settings } = useUserSettings(email);

  const medicines: any[] = data?.findMedicine || [];
  const defaultReminderTimes: string[] = settings?.medicineDefaults
    ?.defaultReminderTimes || ["08:00", "14:00", "20:00"];

  const handleDelete = async (id: string, medicineName: string) => {
    const result = await showConfirm.delete(
      "Delete Medication",
      `Are you sure you want to delete "${medicineName}"? This action cannot be undone.`
    );

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/api/medicine/${id}`);
        medicineNotifications.deleted(medicineName);
        if (refetch) {
          refetch();
        } else {
          window.location.reload();
        }
      } catch (error) {
        console.error("Failed to delete medicine", error);
        medicineNotifications.deleted(
          "Failed to delete medicine. Please try again."
        );
      }
    }
  };

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-emerald-50 via-indigo-100 to-amber-100 text-black rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 w-full">
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
        {medicines.length === 0 ? (
          <div className="flex flex-col items-center py-10">
            <FaPills className="text-5xl text-gray-300 mb-4" />
            <h2 className="text-lg text-center text-gray-500 mb-2">
              You have no medicines to take now.
              <br />
              <span className="text-primary font-semibold">
                {" "}
                Just one step now, add your meds, and you'll never miss a dose
                again.
              </span>
            </h2>
            <Link
              to="/add-medicine"
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
            >
              Add Medication
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden md:block w-full overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-left">
                    <th className="py-4 px-3 md:px-6 font-semibold">
                      Medication
                    </th>
                    <th className="py-4 px-3 md:px-6 font-semibold">Dosage</th>
                    <th className="py-4 px-3 md:px-6 font-semibold">
                      Frequency
                    </th>
                    <th className="py-4 px-3 md:px-6 font-semibold">Time</th>
                    <th className="py-4 px-3 md:px-6 font-semibold">
                      Start Date
                    </th>
                    <th className="py-4 px-3 md:px-6 font-semibold">
                      Total Duration
                    </th>
                    <th className="py-4 px-3 md:px-6 font-semibold">
                      Current Duration
                    </th>
                    <th className="py-4 px-3 md:px-6 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((med: Medicine) => (
                    <tr
                      key={med.id}
                      className="border-b last:border-b-0 hover:bg-gray-50 transition"
                    >
                      <td className="py-4 px-3 md:px-6 flex items-center gap-4">
                        {getMedicineIcon(med.durationDays)}
                        <span className="font-semibold text-lg">
                          {med.name}
                        </span>
                      </td>
                      <td className="py-4 px-3 md:px-6 font-medium">
                        {med.dosage}
                      </td>
                      <td className="py-4 px-3 md:px-6 font-medium">
                        {getFreq(med.frequency)}
                      </td>

                      <td className="py-4 px-3 md:px-6 font-medium">
                        {getReminderTimes(med, defaultReminderTimes)}
                      </td>
                      <td className="py-4 px-3 md:px-6 font-medium">
                        {med.startDate?.slice(0, 10)}
                      </td>
                      <td
                        className={`py-4 px-3 md:px-6 font-bold ${getRemainingColor(
                          med.originalDurationDays
                        )}`}
                      >
                        {med.originalDurationDays} days
                      </td>
                      <td
                        className={`py-4 px-3 md:px-6 font-bold ${getRemainingColor(
                          med.durationDays
                        )}`}
                      >
                        {med.durationDays} days
                      </td>
                      <td className="py-4 px-3 md:px-6 flex gap-4 text-xl">
                        <button className="hover:text-indigo-600" title="Edit">
                          <Link to={`/update-medicine/${med.id}`}>
                            <FaEdit />
                          </Link>
                        </button>

                        <button
                          className="hover:text-red-500"
                          title="Delete"
                          onClick={() => handleDelete(med.id, med.name)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-4 md:hidden w-full">
              {medicines.map((med: Medicine) => (
                <div
                  key={med.id}
                  className="flex flex-col bg-white rounded-2xl shadow-lg border-1 p-4 border-indigo-500 relative overflow-hidden"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex-shrink-0">
                      {getMedicineIcon(med.durationDays)}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg text-indigo-700 mb-1">
                        {med.name}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-1">
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {med.dosage}
                        </span>
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {getFreq(med.frequency)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        {getReminderTimes(med, defaultReminderTimes)}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-2">
                      <button
                        className="rounded-full p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 shadow-sm"
                        title="Edit"
                      >
                        <Link to={`/update-medicine/${med.id}`}>
                          <FaEdit />
                        </Link>
                      </button>

                      <button
                        className="rounded-full p-2 bg-red-50 hover:bg-red-100 text-red-500 shadow-sm"
                        title="Delete"
                        onClick={() => handleDelete(med.id, med.name)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                    <div className="text-xs text-gray-500 font-medium">
                      Start:{" "}
                      <span className="font-semibold text-gray-700">
                        {med.startDate?.slice(0, 10)}
                      </span>
                    </div>
                    <div
                      className={`font-bold text-xs ${getRemainingColor(
                        med.durationDays
                      )}`}
                    >
                      {med.durationDays} days
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyMedications;
