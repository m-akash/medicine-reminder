import { Link } from "react-router-dom";
import useMedicinesUser from "../../hooks/useMedicinesUser.tsx";
import useAuth from "../../hooks/useAuth.tsx";
import { Medicine, Medicine as MedicineBase } from "../../types/index.ts";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure.tsx";

const periodMeta = [
  {
    period: "Morning",
    time: "8:00 AM",
    icon: (
      <span className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
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
  },
  {
    period: "Afternoon",
    time: "2:00 PM",
    icon: (
      <span className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full">
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
  },
  {
    period: "Evening",
    time: "8:00 PM",
    icon: (
      <span className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full">
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
  },
];

const periodTimes = [
  { hour: 8, minute: 0 },
  { hour: 14, minute: 0 },
  { hour: 20, minute: 0 },
];

const DailyMedications = () => {
  const { user } = useAuth();
  const email = user?.email || "";
  const { data } = useMedicinesUser(email);
  const medicines: Medicine[] = data?.findMedicine || [];

  const [takenMap, setTakenMap] = useState<Record<string, string>>({});
  const axiosSecure = useAxiosSecure();
  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    if (!medicines.length) return;
    const fetchAll = async () => {
      const results: Record<string, string> = {};
      await Promise.all(
        medicines.map(async (med) => {
          try {
            const res = await axiosSecure.get(
              `/api/medicine/${med.id}/taken?date=${today}`
            );
            results[med.id!] = res.data.takenDay?.taken || "0-0-0";
          } catch {
            results[med.id!] = "0-0-0";
          }
        })
      );
      setTakenMap(results);
    };
    fetchAll();
  }, [medicines, today, axiosSecure]);

  const periodMeds: Medicine[][] = [[], [], []];
  medicines.forEach((med: Medicine) => {
    if (!med.frequency) return;
    const freqArr = med.frequency.split("-");
    freqArr.forEach((val: string, idx: number) => {
      if (val === "1") {
        periodMeds[idx].push(med);
      }
    });
  });

  const updateTakenMutation = useMutation({
    mutationFn: async ({
      id,
      taken,
    }: {
      id: string | number;
      taken: string;
    }) => {
      return axiosSecure.put(`/api/medicine/${id}/taken`, {
        date: today,
        taken,
      });
    },
    onSuccess: (_, variables) => {
      setTakenMap((prev) => ({ ...prev, [variables.id]: variables.taken }));
    },
  });

  const handleToggleTaken = (med: Medicine, periodIdx: number) => {
    let takenArr = takenMap[med.id!]
      ? takenMap[med.id!].split("-")
      : ["0", "0", "0"];
    takenArr[periodIdx] = takenArr[periodIdx] === "1" ? "0" : "1";
    const newTaken = takenArr.join("-");
    updateTakenMutation.mutate({ id: med.id!, taken: newTaken });
  };

  const getPeriodBadge = (meds: Medicine[], periodIdx: number) => {
    if (meds.length === 0) {
      return { text: "Upcoming", color: "bg-gray-100 text-gray-700" };
    }
    const takenCount = meds.filter((med) => {
      const takenArr = takenMap[med.id!]
        ? takenMap[med.id!].split("-")
        : ["0", "0", "0"];
      return takenArr[periodIdx] === "1";
    }).length;

    const now = new Date();
    const scheduled = new Date();
    scheduled.setHours(
      periodTimes[periodIdx].hour,
      periodTimes[periodIdx].minute,
      0,
      0
    );

    if (takenCount === meds.length) {
      return { text: "Completed", color: "bg-green-100 text-green-700" };
    }
    if (takenCount > 0) {
      return { text: "In Progress", color: "bg-yellow-100 text-yellow-700" };
    }
    if (now > scheduled) {
      return { text: "Missed", color: "bg-red-100 text-red-700" };
    }
    return { text: "Upcoming", color: "bg-indigo-100 text-indigo-700" };
  };

  return (
    <div className=" flex flex-col items-center justify-center relative">
      <div className="bg-white rounded-2xl shadow-md p-2 sm:p-4 md:p-8 w-full max-w-md md:max-w-7xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-blue-700 text-center">
          Today's Medications
        </h1>
        <div className="flex flex-col md:flex-row md:gap-6 gap-4 w-full">
          {periodMeta.map((meta, idx) => (
            <div
              key={meta.period}
              className={`w-full md:flex-1 rounded-xl p-4 md:p-6 ${meta.bg} text-black flex flex-col relative mb-4 md:mb-0`}
            >
              {(() => {
                const badge = getPeriodBadge(periodMeds[idx], idx);
                return (
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-lg text-xs md:text-sm font-semibold ${badge.color}`}
                  >
                    {badge.text}
                  </span>
                );
              })()}
              <div className="flex items-center gap-3 md:gap-4 mb-4">
                <span className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full">
                  {meta.icon}
                </span>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold">
                    {meta.period}
                  </h2>
                  <p className="text-gray-500 font-medium text-sm md:text-base">
                    {meta.time}
                  </p>
                </div>
              </div>
              <div className="mt-2 space-y-3 md:space-y-4">
                {periodMeds[idx].length === 0 ? (
                  <div className="text-gray-400">No medicines</div>
                ) : (
                  periodMeds[idx].map((med: Medicine) => {
                    let takenArr = takenMap[med.id!]
                      ? takenMap[med.id!].split("-")
                      : ["0", "0", "0"];
                    let isTaken = takenArr[idx] === "1";
                    const now = new Date();
                    const scheduled = new Date();
                    scheduled.setHours(
                      periodTimes[idx].hour,
                      periodTimes[idx].minute,
                      0,
                      0
                    );
                    const canMarkTaken = now >= scheduled;
                    return (
                      <div
                        key={med.id || med.name}
                        className="flex items-center gap-2 md:gap-3"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            canMarkTaken && handleToggleTaken(med, idx)
                          }
                          className={`focus:outline-none ${
                            !canMarkTaken ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          aria-label={
                            isTaken ? "Mark as not taken" : "Mark as taken"
                          }
                          disabled={!canMarkTaken}
                          title={
                            canMarkTaken
                              ? ""
                              : "You can only mark as taken after the scheduled time"
                          }
                        >
                          {isTaken ? (
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
                        </button>
                        <span className="text-base md:text-lg font-medium text-gray-800">
                          {med.name} ({med.dosage})
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Link to="/add-medicine">
        <button
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl md:hidden transition-all duration-200"
          aria-label="Add Medication"
        >
          +
        </button>
      </Link>
    </div>
  );
};

export default DailyMedications;
