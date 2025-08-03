import React, { useEffect, useState, useMemo } from "react";
import type { JSX } from "react";
import { FaPills, FaCheckCircle, FaClock } from "react-icons/fa";
import useAuth from "../../hooks/useAuth.tsx";
import useMedicinesUser from "../../hooks/useMedicinesUser.tsx";
import useAxiosSecure from "../../hooks/useAxiosSecure.tsx";
import { Medicine } from "../../types/index.ts";
import { format, addDays, startOfDay } from "date-fns";
import BaseHelmet from "../../components/BaseHelmet.tsx";
import { medicineNotifications } from "../../utils/notifications.ts";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const periodTimes = [
  { label: "Morning", time: "8:00 AM", idx: 0 },
  { label: "Afternoon", time: "2:00 PM", idx: 1 },
  { label: "Evening", time: "8:00 PM", idx: 2 },
];

const statusStyles: { [key: string]: string } = {
  taken: "text-green-600 bg-green-100",
  upcoming: "text-blue-600 bg-blue-100",
  missed: "text-red-600 bg-red-100",
};

const statusIcon: { [key: string]: JSX.Element } = {
  taken: <FaCheckCircle className="text-green-500" />,
  upcoming: <FaClock className="text-blue-500" />,
  missed: <FaClock className="text-red-500" />,
};

function getDateOfWeekday(weekdayIdx: number) {
  const today = new Date();
  const current = today.getDay();
  const diff = weekdayIdx - current;
  const date = addDays(startOfDay(today), diff);
  return format(date, "yyyy-MM-dd");
}

const Schedule = () => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const today = new Date().getDay();
  const { user } = useAuth();
  const email = user?.email || "";
  const { data, isLoading, isError } = useMedicinesUser(email);
  const medicines: Medicine[] = useMemo(() => data?.findMedicine || [], [data]);
  const axiosSecure = useAxiosSecure();
  const [takenMap, setTakenMap] = useState<Record<string, string>>({});
  const [loadingTaken, setLoadingTaken] = useState(false);

  const scheduledMeds = useMemo(() => {
    const meds: { med: Medicine; periods: number[] }[] = [];
    if (!medicines.length) return meds;
    const selectedDate = getDateOfWeekday(selectedDay);
    const selectedDateObj = new Date(selectedDate);
    medicines.forEach((med) => {
      const start = new Date(med.startDate);
      const end = addDays(start, med.durationDays - 1);
      if (selectedDateObj < start || selectedDateObj > end) return;
      const freqArr = med.frequency.split("-").map(Number);
      const periods: number[] = [];
      freqArr.forEach((val: number, idx: number) => {
        if (val === 1) periods.push(idx);
      });
      if (periods.length > 0) {
        meds.push({ med, periods });
      }
    });
    return meds;
  }, [medicines, selectedDay]);

  useEffect(() => {
    if (!scheduledMeds.length) {
      setTakenMap({});
      return;
    }
    let cancelled = false;
    const fetchAll = async () => {
      setLoadingTaken(true);
      const results: Record<string, string> = {};
      const date = getDateOfWeekday(selectedDay);
      await Promise.all(
        scheduledMeds.map(async ({ med }) => {
          try {
            const res = await axiosSecure.get(
              `/api/medicine/${med.id}/taken?date=${date}`
            );
            results[med.id] = res.data.takenDay?.taken || "0-0-0";
          } catch {
            results[med.id] = "0-0-0";
          }
        })
      );
      if (!cancelled) setTakenMap(results);
      setLoadingTaken(false);
    };
    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [scheduledMeds, selectedDay]);

  const periodMeds = useMemo(() => {
    const groups: { [periodIdx: number]: { med: Medicine; taken: boolean }[] } =
      {
        0: [],
        1: [],
        2: [],
      };
    scheduledMeds.forEach(({ med, periods }) => {
      const takenArr = takenMap[med.id]?.split("-") || ["0", "0", "0"];
      periods.forEach((periodIdx) => {
        groups[periodIdx].push({ med, taken: takenArr[periodIdx] === "1" });
      });
    });
    return groups;
  }, [scheduledMeds, takenMap]);

  function getStatus(
    med: Medicine,
    periodIdx: number
  ): "taken" | "missed" | "upcoming" {
    const takenArr = takenMap[med.id]?.split("-") || ["0", "0", "0"];
    if (takenArr[periodIdx] === "1") return "taken";
    const selectedDate = getDateOfWeekday(selectedDay);
    const now = new Date();
    const scheduled = new Date(selectedDate);
    const [hour, minute] = periodTimes[periodIdx].time
      .replace(" AM", "")
      .replace(" PM", "")
      .split(":")
      .map(Number);
    scheduled.setHours(
      periodTimes[periodIdx].time.includes("PM") && hour !== 12
        ? hour + 12
        : hour,
      minute,
      0,
      0
    );
    if (now > scheduled && selectedDay === today) return "missed";
    if (selectedDay < today) return "missed";
    return "upcoming";
  }

  async function handleMarkAsTaken(med: Medicine, periodIdx: number) {
    const date = getDateOfWeekday(selectedDay);
    const prevTaken = takenMap[med.id]?.split("-") || ["0", "0", "0"];
    const newTaken = [...prevTaken];
    newTaken[periodIdx] = "1";
    try {
      setLoadingTaken(true);
      await axiosSecure.put(`/api/medicine/${med.id}/taken`, {
        date,
        taken: newTaken.join("-"),
      });
      const res = await axiosSecure.get(
        `/api/medicine/${med.id}/taken?date=${date}`
      );
      setTakenMap((prev) => ({
        ...prev,
        [med.id]: res.data.takenDay?.taken || "0-0-0",
      }));
      medicineNotifications.markedAsTaken(med.name);
    } catch (err) {
      medicineNotifications.markedAsTaken(
        "Failed to mark as taken. Please try again."
      );
    } finally {
      setLoadingTaken(false);
    }
  }

  return (
    <>
      <BaseHelmet
        title="Medication Schedule - Medicine Reminder"
        description="View your daily medication schedule, track taken doses, and manage your medication routine with our comprehensive scheduling system."
      />
      <div className="min-h-screen bg-gradient-to-r from-emerald-50 via-indigo-100 to-amber-100 shadow-lg md:py-8 md:px-2 flex flex-col items-center">
        <div className="w-full max-w-7xl bg-gradient-to-r from-emerald-50 via-indigo-100 to-amber-100 shadow-lg md:rounded-3xl p-6 md:p-10 flex flex-col gap-6">
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-2 text-center">
            Medication Schedule
          </h1>
          <div className="flex justify-between gap-2 mb-6">
            {weekDays.map((day, idx) => (
              <button
                key={day}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-200 text-sm md:text-base
                  ${
                    selectedDay === idx
                      ? "bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow"
                      : today === idx
                      ? "border-2 border-indigo-400 text-indigo-700 bg-indigo-50"
                      : "bg-gray-100 text-gray-600 hover:bg-indigo-50"
                  }
                `}
                onClick={() => setSelectedDay(idx)}
              >
                {day}
              </button>
            ))}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              {weekDays[selectedDay]}'s Medications
            </h2>
            {isLoading || loadingTaken ? (
              <div className="text-center text-gray-400 py-8">Loading...</div>
            ) : isError ? (
              <div className="text-center text-red-400 py-8">
                You have no medications schedule now!.
              </div>
            ) : scheduledMeds.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                <FaPills className="mx-auto text-4xl mb-2" />
                No medications scheduled for this day.
              </div>
            ) : (
              <ul className="flex flex-col gap-4">
                {periodTimes.map((period, periodIdx) => (
                  <React.Fragment key={period.label}>
                    {periodMeds[periodIdx].length > 0 && (
                      <li className="mb-2">
                        <div className="font-semibold text-indigo-700 mb-1">
                          {period.label}{" "}
                          <span className="text-gray-500 text-xs">
                            ({period.time})
                          </span>
                        </div>
                        <ul className="flex flex-col gap-2">
                          {periodMeds[periodIdx].map(({ med, taken }, i) => {
                            const status = getStatus(med, periodIdx);
                            return (
                              <li
                                key={med.id + "-" + periodIdx}
                                className={`flex items-center gap-4 p-4 rounded-xl shadow-sm border ${statusStyles[status]}`}
                              >
                                <span className="text-2xl">
                                  {statusIcon[status]}
                                </span>
                                <div className="flex-1">
                                  <div className="font-bold text-lg">
                                    {med.name}
                                  </div>
                                  <div className="text-gray-600 text-sm">
                                    {med.dosage}
                                  </div>
                                </div>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}
                                >
                                  {status.charAt(0).toUpperCase() +
                                    status.slice(1)}
                                </span>
                                {status === "missed" && (
                                  <button
                                    className="ml-2 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold hover:bg-green-600 transition"
                                    onClick={() =>
                                      handleMarkAsTaken(med, periodIdx)
                                    }
                                    disabled={loadingTaken}
                                  >
                                    Mark as Taken
                                  </button>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    )}
                  </React.Fragment>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Schedule;
